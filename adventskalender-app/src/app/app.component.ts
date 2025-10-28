import {Component} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {Preferences} from "@capacitor/preferences";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true
})
export class AppComponent {
  constructor(private router: Router,
              private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then((res) => {
      return Preferences.get({key: 'onboarding_done'});
    }).then((res) => {
      const {value} = res;
      if (value === 'true') {
        return this.router.navigate(['/home']);
      } else {
        return this.router.navigate(['/onboarding']);
      }
    });
  }

}
