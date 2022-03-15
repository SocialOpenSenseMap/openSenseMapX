import { ID } from '@datorama/akita';

export interface Notification {
  _id: ID;
  notifications: Array<any>;
  unread: Boolean;
  notificationRules: Array<any>;
  notificationConnectors: Array<any>;
}
