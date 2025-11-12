import {AfterViewInit, Component, ElementRef, inject} from '@angular/core';
import {Router} from "@angular/router";
import {IonContent, IonHeader, IonTitle, IonToast, IonToolbar} from "@ionic/angular/standalone";
import {getDateToday} from "../shared/dev-date-change";


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  imports: [
    IonToast,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  standalone: true
})
export class LandingpageComponent implements AfterViewInit {

  el: ElementRef = inject(ElementRef);
  router: Router = inject(Router)

  isAlertOpen: boolean = false;
  dayClicked: number = 0;


  ngAfterViewInit() {
    const paths = this.el.nativeElement.querySelectorAll('svg path[id]');
    paths.forEach((path: SVGPathElement) => {
      const id = path.getAttribute('id');
      const today = getDateToday();
      if (id) {
        let day: number = 0;
        if (id.startsWith("path_n_")) {
          day = id.split("path_n_")[1] as unknown as number;
        } else if (id.startsWith("path-")) {
          day = id.split("path-")[1] as unknown as number;
        }
        //add styling
        if (day > today) {
          path.addEventListener('click', () => {
            this.isAlertOpen = true;
            this.dayClicked = day;
          });
        }

        //add interactivity
        if (day <= today) {
          path.addEventListener('click', () => {
            this.router.navigate([`/${day}`]);

          });
        }
      }
    });
  }

}
