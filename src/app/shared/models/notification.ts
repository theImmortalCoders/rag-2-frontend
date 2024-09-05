export interface INotification {
  id: number;
  message: string;
  duration?: number;
  dismissible: boolean;
}
