import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Content} from "../../service/content";
import {IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {LineBreakPipe} from "../../pipes/line-break-pipe";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, LineBreakPipe],

})
export class DayComponent  implements OnInit {

  dayNumber!: number;
  content?: Gedicht;

  contentService = inject(Content);
  route = inject(ActivatedRoute)

  ngOnInit() {
    // Listen for changes in route params
    this.route.paramMap.subscribe(params => {
      this.dayNumber = Number(params.get('id'));
      this.contentService.getDayGedicht(this.dayNumber).subscribe(text => {
        this.content = text;
      });
    });

  }

}

export type Gedicht = {
  titel: string,
  autor: string,
  gedicht: string
}
