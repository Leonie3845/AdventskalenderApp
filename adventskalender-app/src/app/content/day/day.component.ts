import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ContentService, ContentType, Gedicht, Raetsel, Rezept, Video} from "../../service/content/content.service";
import {IonBackButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {LineBreakPipe} from "../../pipes/line-break-pipe";
import {mergeMap, Observable, of} from "rxjs";
import {NgStyle} from "@angular/common";
import {NotificationService} from "../../service/notification/notification.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SnowForecastComponent} from "../snow-forecast/snow-forecast.component";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, LineBreakPipe, IonButton, NgStyle, SnowForecastComponent],

})
export class DayComponent implements OnInit {

  dayNumber!: number;
  gedicht?: Gedicht;
  raetsel?: Raetsel;
  rezept?: Rezept;
  video?: Video;
  backgroundImage?: string;
  backgroundPosition: string = 'center';
  type: ContentType = ContentType.Gedicht;
  safeUrl!: SafeResourceUrl;

  solutionVisible: boolean = false;

  route = inject(ActivatedRoute)
  sanitizer: DomSanitizer = inject(DomSanitizer);
  contentService = inject(ContentService);
  notificationService = inject(NotificationService)

  ngOnInit() {
    // Listen for changes in route params
    this.route.paramMap.pipe(
      mergeMap((params) => {
        this.dayNumber = Number(params.get('id'));
        return this.contentService.getTypeOfDay(this.dayNumber)
      }),
      mergeMap((type: ContentType): Observable<Gedicht | Raetsel | Rezept | Video | undefined> => {
        this.type = type
        if (type == ContentType.Gedicht) {
          return this.contentService.getDayGedicht(this.dayNumber)
        } else if (type == ContentType.Raetsel) {
          return this.contentService.getDayRaetsel(this.dayNumber)
        } else if (type == ContentType.Rezept) {
          return this.contentService.getDayRezept(this.dayNumber)
        } else if (type == ContentType.Video) {
          return this.contentService.getDayVideo(this.dayNumber)
        }
        return of()
      })
    ).subscribe((res: Raetsel | Gedicht | Rezept | Video | undefined) => {
      if (this.type == ContentType.Raetsel) {
        this.raetsel = res as Raetsel;
      } else if (this.type == ContentType.Gedicht) {
        this.gedicht = res as Gedicht;
        this.backgroundImage = this.gedicht.background_path;
        this.backgroundPosition = this.gedicht.background_position ?? this.backgroundPosition;
      } else if (this.type == ContentType.Rezept) {
        this.rezept = res as Rezept;
        this.backgroundImage = this.rezept.background_path;
        this.backgroundPosition = this.rezept.background_position ?? this.backgroundPosition;
      } else if (this.type == ContentType.Video) {
        this.video = res as Video;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video!.embedded_video);
        this.backgroundImage = this.video.background_path;
        this.backgroundPosition = this.video.background_position ?? this.backgroundPosition;
      }
    })

    //cancel notification for this day
    this.notificationService.cancelDayNotification(this.dayNumber);

  }

  protected readonly ContentType = ContentType;
}


