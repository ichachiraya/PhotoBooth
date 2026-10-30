import type { CameraErrorKind } from '../../hooks/useCamera';
import { useI18n } from '../../i18n/useI18n';

const MESSAGES: Record<CameraErrorKind, { en: string; th: string }> = {
  denied: {
    en: "Camera access was denied. You can allow it in your browser's site settings, or continue by importing photos instead.",
    th: 'ไม่ได้รับอนุญาตให้ใช้กล้อง คุณสามารถอนุญาตได้ในตั้งค่าเบราว์เซอร์ หรือดำเนินการต่อด้วยการนำเข้ารูปภาพแทน',
  },
  'not-found': {
    en: 'No camera was found on this device. You can continue by importing photos instead.',
    th: 'ไม่พบกล้องบนอุปกรณ์นี้ คุณสามารถดำเนินการต่อด้วยการนำเข้ารูปภาพแทน',
  },
  'in-use': {
    en: 'The camera seems to be in use by another app. Close it and try again, or continue by importing photos.',
    th: 'กล้องอาจถูกใช้งานโดยแอปอื่นอยู่ ลองปิดแอปนั้นแล้วลองใหม่ หรือดำเนินการต่อด้วยการนำเข้ารูปภาพ',
  },
  insecure: {
    en: 'The camera only works over HTTPS or on localhost. You can continue by importing photos instead.',
    th: 'กล้องจะทำงานได้เฉพาะบน HTTPS หรือ localhost คุณสามารถดำเนินการต่อด้วยการนำเข้ารูปภาพแทน',
  },
  unsupported: {
    en: "This browser doesn't support camera capture. You can continue by importing photos instead.",
    th: 'เบราว์เซอร์นี้ไม่รองรับการถ่ายภาพด้วยกล้อง คุณสามารถดำเนินการต่อด้วยการนำเข้ารูปภาพแทน',
  },
  unknown: {
    en: 'The camera could not be started. You can continue by importing photos instead.',
    th: 'ไม่สามารถเปิดกล้องได้ คุณสามารถดำเนินการต่อด้วยการนำเข้ารูปภาพแทน',
  },
};

export function CameraPermissionError({ kind }: { kind: CameraErrorKind }) {
  const { lang } = useI18n();
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-6 text-center"
    >
      <p className="text-text-secondary">{MESSAGES[kind][lang]}</p>
    </div>
  );
}
