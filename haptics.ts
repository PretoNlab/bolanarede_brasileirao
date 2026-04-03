
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const impactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

export const impactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

export const impactHeavy = async () => {
  await Haptics.impact({ style: ImpactStyle.Heavy });
};

export const hapticSelection = async () => {
  await Haptics.selectionStart();
};

export const hapticNotificationSuccess = async () => {
  await Haptics.notification({ type: 'SUCCESS' as any });
};

export const hapticNotificationError = async () => {
  await Haptics.notification({ type: 'ERROR' as any });
};
