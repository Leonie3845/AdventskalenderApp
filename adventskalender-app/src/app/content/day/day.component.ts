import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Content, ContentType, Raetsel} from "../../service/content";
import {IonBackButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {LineBreakPipe} from "../../pipes/line-break-pipe";
import {mergeMap, Observable, of} from "rxjs";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, LineBreakPipe, IonButton],

})
export class DayComponent implements OnInit {

  dayNumber!: number;
  gedicht?: Gedicht;
  raetsel?: Raetsel;
  type: ContentType = ContentType.Gedicht;

  solutionVisible: boolean = false;

  contentService = inject(Content);
  route = inject(ActivatedRoute)

  ngOnInit() {
    // Listen for changes in route params
    this.route.paramMap.pipe(
      mergeMap((params) => {
        this.dayNumber = Number(params.get('id'));
        return this.contentService.getTypeOfDay(this.dayNumber)
      }),
      mergeMap((type: ContentType): Observable<Gedicht | Raetsel | undefined> => {
        this.type = type
        if (type == ContentType.Gedicht) {
          return this.contentService.getDayGedicht(this.dayNumber)
        } else if (type == ContentType.Raetsel) {
          return this.contentService.getDayRaetsel(this.dayNumber)
        }
        return of()
      })
    ).subscribe((res: Raetsel | Gedicht | undefined) => {
      if (this.type == ContentType.Raetsel) {
        this.raetsel = res as Raetsel;
      } else if (this.type == ContentType.Gedicht) {
        this.gedicht = res as Gedicht;
      }
    })


  }

  protected readonly ContentType = ContentType;
}

export type Gedicht = {
  titel: string,
  autor: string,
  gedicht: string
}
