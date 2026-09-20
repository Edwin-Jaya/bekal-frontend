export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackData {
  type: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}