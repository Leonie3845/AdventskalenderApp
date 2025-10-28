import {Injectable} from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {LocalNotifications} from "@capacitor/local-notifications";
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly PREF_KEY = 'notifications_scheduled';

  /**
   * Initializes notifications if not already scheduled.
   */
  async initNotifications() {
    const {value} = await Preferences.get({key: this.PREF_KEY});
    if (value === 'true') {
      return;
    }

    // Detect platform
    if (Capacitor.isNativePlatform()) {
      await this.initNativeNotifications();
    } else {
      await this.initWebNotifications();
    }

    await Preferences.set({key: this.PREF_KEY, value: 'true'});
  }

  private async initWebNotifications() {
    if (!('Notification' in window)) {
      console.warn('[Notifications] Browser does not support notifications');
      return;
    }

    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      console.warn('[Notifications] Browser permission not granted');
      return;
    }

    // Im Browser werden keine regelmäßigen notifications gescheduled
    this.showWebNotification('🎄 Der Advent beginnt bald!', 'Wir werden dir Errinnerungs-Benachrichtigungen schicken!');
  }

  private showWebNotification(title: string, body: string) {
    new Notification(title, {body});
  }


  private async initNativeNotifications() {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return;
    }

    const notifications = [];

    for (let day = 1; day <= 24; day++) {
      const date = new Date(2025, 11, day, 9, 0, 0); // Dec = 11 (0-based)
      if (date.getTime() < Date.now()) continue; // skip past dates

      notifications.push({
        id: day,
        title: `🎄 Adventskalender Tag ${day}`,
        body: `Vergiss nicht das heutige Türchen zu öffnen!`,
        schedule: {at: date},
        sound: 'default',
      });
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({notifications});
    }
  }

  async cancelDayNotification(day: number) {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({ notifications: [{ id: day }] });
    }
  }

}
