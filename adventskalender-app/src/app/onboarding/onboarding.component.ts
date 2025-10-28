import {Component} from '@angular/core';

import {NotificationService} from "../service/notification/notification.service";
import {Router} from "@angular/router";
import {Preferences} from "@capacitor/preferences";
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButton,
    IonTitle,
    IonContent
  ],
  standalone: true
})
export class OnboardingComponent {

  constructor(
    private router: Router,
    private notifications: NotificationService
  ) {
  }

  async enableNotifications() {
    await this.notifications.initNotifications();
    await Preferences.set({key: 'onboarding_done', value: 'true'});
    // After scheduling, navigate to main app (e.g., calendar or home)
    this.router.navigate(['/landingpage']);
  }

  skip() {
    this.router.navigate(['/landingpage']);
  }

}
