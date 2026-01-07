/* eslint-disable react-refresh/only-export-components */
import {
  Droplet, Droplets, Rocket, Zap, Hand, Home, Compass, MapPinned, MapPin, Dices, Star,
  ThumbsDown, Flame, Milk, Rainbow, Shield, Sunrise, Moon, Beer,
  Calendar, Lock, GlassWater, Trophy, Sparkles, Target, Camera,
  StickyNote, Users, Map, Building2, Clock, Award, Crown, Eye,
  Gauge, Coins, Expand, Layers, RefreshCw, Images, Check, X,
  Spade, Heart, Diamond, Club, Copy, Shuffle, Repeat, Briefcase,
  Palmtree, TrendingUp, Gem, Joystick, ListOrdered, Percent,
  Asterisk, Flag, UserPlus, Share2, Plane, Luggage, CalendarCheck,
  ArrowRightLeft, Footprints, Landmark, Leaf, Thermometer
} from 'lucide-react';

// Custom text-based badge icons
const HashIcon = ({ size, className }) => (
  <span className={`font-bold ${className}`} style={{ fontSize: size * 0.7 }}>10</span>
);
const ThreeIcon = ({ size, className }) => (
  <span className={`font-bold ${className}`} style={{ fontSize: size * 0.7 }}>3</span>
);
const TwentyFiveIcon = ({ size, className }) => (
  <span className={`font-bold ${className}`} style={{ fontSize: size * 0.55 }}>25</span>
);
const FiftyIcon = ({ size, className }) => (
  <span className={`font-bold ${className}`} style={{ fontSize: size * 0.55 }}>50</span>
);
const HundredIcon = ({ size, className }) => (
  <span className={`font-bold ${className}`} style={{ fontSize: size * 0.5 }}>100</span>
);

// Icon map for badge icons
export const BADGE_ICONS = {
  // Original icons
  'droplet': Droplet,
  'rocket': Rocket,
  'hash': HashIcon,
  'zap': Zap,
  'three': ThreeIcon,
  'hand': Hand,
  'home': Home,
  'compass': Compass,
  'map-pinned': MapPinned,
  'dices': Dices,
  'star': Star,
  'thumbs-down': ThumbsDown,
  'flame': Flame,
  'pepper': Flame,
  'milk': Milk,
  'rainbow': Rainbow,
  'shield': Shield,
  'sunrise': Sunrise,
  'moon': Moon,
  'beer': Beer,
  'calendar': Calendar,
  'lock': Lock,
  'wine': GlassWater,
  'trophy': Trophy,
  'sparkles': Sparkles,
  'target': Target,
  'camera': Camera,
  'sticky-note': StickyNote,
  'users': Users,
  'map': Map,
  'building': Building2,
  'clock': Clock,
  'award': Award,
  'crown': Crown,

  // Slot badges
  'eye': Eye,
  'gauge': Gauge,
  'coins': Coins,
  'expand': Expand,
  'layers': Layers,
  'refresh': RefreshCw,
  'images': Images,
  'check': Check,

  // VP badges
  'spade': Spade,
  'heart': Heart,
  'diamond': Diamond,
  'club': Club,
  'copy': Copy,
  'x': X,
  'shuffle': Shuffle,
  'repeat': Repeat,
  'briefcase': Briefcase,
  'palmtree': Palmtree,
  'trending-up': TrendingUp,
  'gem': Gem,
  'joystick': Joystick,
  'list-ordered': ListOrdered,
  'percent': Percent,
  'asterisk': Asterisk,

  // Trip badges
  'flag': Flag,
  'user-plus': UserPlus,
  'share': Share2,
  'plane': Plane,
  'luggage': Luggage,
  'calendar-check': CalendarCheck,
  'arrow-right-left': ArrowRightLeft,
  'footprints': Footprints,
  'landmark': Landmark,

  // Spicy badges
  'leaf': Leaf,
  'thermometer': Thermometer,
  'droplets': Droplets,
  'map-pin': MapPin,
};
