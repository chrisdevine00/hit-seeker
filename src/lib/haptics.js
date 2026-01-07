// Haptics utility with Capacitor native support and web fallback
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { STORAGE_KEYS } from '../constants';

// Check if we're on a native platform
const isNative = () => window.Capacitor?.isNativePlatform?.() ?? false;

// Check if web vibration API is available
const canVibrate = () => 'vibrate' in navigator;

// Check if haptics are enabled (reads from localStorage)
const isHapticsEnabled = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HAPTICS);
    // Default to true if not set
    return stored === null ? true : JSON.parse(stored);
  } catch {
    return true;
  }
};

/**
 * Light impact - for button taps, selections
 */
export const hapticLight = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if (canVibrate()) {
      navigator.vibrate(10);
    }
  } catch {
    // Silently fail - haptics are non-critical
  }
};

/**
 * Medium impact - for confirmations, success actions
 */
export const hapticMedium = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else if (canVibrate()) {
      navigator.vibrate(20);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Heavy impact - for important actions, errors
 */
export const hapticHeavy = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } else if (canVibrate()) {
      navigator.vibrate(30);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Selection changed - for picker/tab changes
 */
export const hapticSelection = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.selectionChanged();
    } else if (canVibrate()) {
      navigator.vibrate(5);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Success notification - for completed actions
 */
export const hapticSuccess = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (canVibrate()) {
      navigator.vibrate([10, 50, 10]);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Warning notification - for warnings
 */
export const hapticWarning = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.notification({ type: NotificationType.Warning });
    } else if (canVibrate()) {
      navigator.vibrate([20, 50, 20]);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Error notification - for errors
 */
export const hapticError = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      await Haptics.notification({ type: NotificationType.Error });
    } else if (canVibrate()) {
      navigator.vibrate([30, 50, 30, 50, 30]);
    }
  } catch {
    // Silently fail
  }
};

/**
 * Celebration - for badge unlocks, achievements
 */
export const hapticCelebration = async () => {
  if (!isHapticsEnabled()) return;
  try {
    if (isNative()) {
      // Double heavy impact for celebration
      await Haptics.impact({ style: ImpactStyle.Heavy });
      setTimeout(async () => {
        await Haptics.notification({ type: NotificationType.Success });
      }, 100);
    } else if (canVibrate()) {
      navigator.vibrate([50, 30, 50, 30, 100]);
    }
  } catch {
    // Silently fail
  }
};
