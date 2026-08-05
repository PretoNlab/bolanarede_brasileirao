
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Haptics are a non-critical nicety. Many mobile browsers (notably iOS Safari,
// which never implemented the Vibration API) reject these calls — that must
// never bubble up as an unhandled promise rejection and crash the app.
function safeHaptic(run: () => Promise<void>) {
  try {
    run().catch(() => {});
  } catch {
    // no-op
  }
}

export const impactLight = () => {
  safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
};

export const impactMedium = () => {
  safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }));
};

export const impactHeavy = () => {
  safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }));
};

export const hapticSelection = () => {
  safeHaptic(() => Haptics.selectionStart());
};

export const hapticNotificationSuccess = () => {
  safeHaptic(() => Haptics.notification({ type: 'SUCCESS' as any }));
};

export const hapticNotificationError = () => {
  safeHaptic(() => Haptics.notification({ type: 'ERROR' as any }));
};
