// Photos Hook with Realtime
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export function usePhotos() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      setPhotos({});
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('machine_photos')
        .select('*')
        .eq('trip_id', currentTrip.id);

      if (!error && data) {
        // Group by machine_id
        const grouped = data.reduce((acc, photo) => {
          if (!acc[photo.machine_id]) acc[photo.machine_id] = [];
          acc[photo.machine_id].push(photo);
          return acc;
        }, {});
        setPhotos(grouped);
      }
      setLoading(false);
    };

    fetchPhotos();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`photos:${currentTrip.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'machine_photos',
        filter: `trip_id=eq.${currentTrip.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const photo = payload.new;
          setPhotos(prev => ({
            ...prev,
            [photo.machine_id]: [...(prev[photo.machine_id] || []), photo]
          }));
        } else if (payload.eventType === 'DELETE') {
          setPhotos(prev => {
            const machineId = payload.old.machine_id;
            return {
              ...prev,
              [machineId]: (prev[machineId] || []).filter(p => p.id !== payload.old.id)
            };
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTrip]);

  const addPhoto = async (machineId, file, casino = null) => {
    if (!currentTrip || !user) return;

    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${currentTrip.id}/${machineId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('machine-photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('machine-photos')
      .getPublicUrl(fileName);

    // Create database record
    const { data, error } = await supabase
      .from('machine_photos')
      .insert({
        trip_id: currentTrip.id,
        user_id: user.id,
        machine_id: machineId,
        storage_path: fileName,
        casino
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving photo record:', error);
      return null;
    }

    return { ...data, publicUrl };
  };

  const deletePhoto = async (machineId, photoId) => {
    const photo = photos[machineId]?.find(p => p.id === photoId);
    if (!photo) return;

    // Delete from storage
    await supabase.storage
      .from('machine-photos')
      .remove([photo.storage_path]);

    // Delete from database
    await supabase
      .from('machine_photos')
      .delete()
      .eq('id', photoId);
  };

  const getPhotoUrl = (photo) => {
    if (!photo?.storage_path) return null;
    const { data: { publicUrl } } = supabase.storage
      .from('machine-photos')
      .getPublicUrl(photo.storage_path);
    return publicUrl;
  };

  const getMachinePhotos = (machineId) => photos[machineId] || [];

  const getLatestPhoto = (machineId) => {
    const machinePhotos = getMachinePhotos(machineId);
    return machinePhotos.length > 0 ? machinePhotos[machinePhotos.length - 1] : null;
  };

  return { photos, loading, addPhoto, deletePhoto, getPhotoUrl, getMachinePhotos, getLatestPhoto };
}
