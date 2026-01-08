# Pre-Vegas Checklist

## Before You Leave

### 1. Clear Test Data
Run this SQL in **Supabase Dashboard > SQL Editor**:

```sql
DELETE FROM check_ins;
DELETE FROM machine_photos;
DELETE FROM notes;
DELETE FROM bloodies;
DELETE FROM trip_members;
DELETE FROM trips;
```

### 2. Clear Storage Buckets
In **Supabase Dashboard > Storage**:
- Delete all files in `machine-photos` bucket
- Delete all files in `note-photos` bucket

### 3. Clear Badge History (localStorage)
Badges are stored locally on your device. To reset:

**Option A: Selective Delete**
1. Open Dev Mode (triple-tap header)
2. Expand **LocalStorage** section
3. Find `earned-badges` key and tap the trash icon

**Option B: Full Reset**
1. Open Dev Mode
2. Tap **Clear Cache & Reload**
3. Sign back in

> Note: Each device stores its own badge history. Repeat on all devices if needed.

### 4. Create Fresh Trip
- Open https://hitseeker.app
- Sign in with Google
- Create your Vegas trip (e.g., "Vegas January 2025")

### 5. Test Google OAuth
- Sign out completely
- Sign back in to verify login flow works

### 6. Invite Trip Members
- Go to Trip tab > Settings
- Share the trip code with your crew

---

## Quick Verification Tests

- [ ] Add a test note with photo - verify it saves and displays
- [ ] Check in to a casino (use Force Check-in in dev mode if not in Vegas yet)
- [ ] Verify badges display in Trip tab under "Me" view
- [ ] Switch to "Team" view and verify it shows team locations

---

## Packing List (App-Related)

- [ ] Phone fully charged
- [ ] Portable charger
- [ ] Know your Google account password (for re-auth if needed)
- [ ] Trip share code written down (backup)

---

## In-Vegas Quick Reference

| Problem | Solution |
|---------|----------|
| GPS not working indoors | Dev Mode > Force Check-in |
| Data not syncing | Dev Mode > Force Refresh Data |
| Auth errors | Dev Mode > Refresh Auth Session |
| App completely broken | Dev Mode > Clear Cache & Reload |
| Need to debug | Dev Mode > Copy Debug Report |

---

## Emergency Contacts

- **App Issues**: Check Dev Mode error log, export debug data
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
