import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  standalone: true
})
export class LandingpageComponent implements AfterViewInit {

  constructor(private el: ElementRef, private router: Router) {
  }

  ngAfterViewInit() {
    const paths = this.el.nativeElement.querySelectorAll('svg path[id]');
    paths.forEach((path: SVGPathElement) => {
      path.addEventListener('click', () => {
        const id = path.getAttribute('id');
        if (id) {
          let day;
          if (id.startsWith("path_n_")) {
            day = id.split("path_n_")[1]
          } else if (id.startsWith("path-")) {
            day = id.split("path-")[1]
          }
          this.router.navigate([`/${day}`]);
        }
      });
    });
  }

}
