import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {
  ContentService,
  ContentType,
  ContentTypeMap,
  Gedicht,
  Podcast,
  Raetsel,
  Rezept,
  Str8ts,
  Video,
  WithBackground
} from "../../service/content/content.service";
import {IonBackButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {LineBreakPipe} from "../../pipes/line-break-pipe";
import {mergeMap, of} from "rxjs";
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
  podcast?: Podcast;
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
      mergeMap((type: ContentType)=> {
        this.type = type;
        if (this.type == ContentType.Snowforcast) {
          return of();
        }
        return this.contentService.getDayContent(type as keyof ContentTypeMap, this.dayNumber);
      })
    ).subscribe(content => this.handleContent(content));

    //cancel notification for this day
    this.notificationService.cancelDayNotification(this.dayNumber);

  }


  private handleContent(content: Gedicht | Raetsel | Rezept | Video | Str8ts | Podcast) {
    if ('frage' in content) {
      this.raetsel = content;
    } else {
      const c = content as WithBackground;
      this.backgroundImage = c.background_path;
      this.backgroundPosition = c.background_position ?? this.backgroundPosition;

      if ('gedicht' in content) {
        this.gedicht = content;
      } else if ('zutaten' in content) {
        this.rezept = content;
      } else if ('embedded_video' in content) {
        this.video = content;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(content.embedded_video);
      } else if ('podcast_link' in content) {
        this.podcast = content;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(content.podcast_link);

      }
    }
  }

  protected readonly ContentType = ContentType;
}


