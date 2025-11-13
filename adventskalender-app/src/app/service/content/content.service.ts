import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly jsonUrlGedichtContent = 'assets/content/text-content.json';
  private readonly jsonUrlContentTypMapping = 'assets/content/content-type-mapping.json';
  private readonly jsonUrlRaetselUrl = 'assets/content/raetsel-content.json'
  private readonly jsonUrlRezeptContent = 'assets/content/rezept-content.json'
  private readonly jsonUrlVideoContent = 'assets/content/video-content.json';
  private readonly jsonUrlStr8tsContent = 'assets/content/str8ts-content.json';
  private readonly jsonUrlPodcastContent = 'assets/content/podcast-content.json'




  constructor(private http: HttpClient) {
  }

  getTypeOfDay(dayNumber: number): Observable<ContentType> {
    return this.http.get<Record<string, ContentType>>(this.jsonUrlContentTypMapping).pipe(
      map(data => data[dayNumber])
    );
  }

  getDayContent<T extends keyof ContentTypeMap>(type: T, day: number): Observable<ContentTypeMap[T]>{
    switch (type) {
      case ContentType.Gedicht:
        return this.getDayGedicht(day) as Observable<ContentTypeMap[T]>;
      case ContentType.Raetsel:
        return this.getDayRaetsel(day) as Observable<ContentTypeMap[T]>;
      case ContentType.Rezept:
        return this.getDayRezept(day) as Observable<ContentTypeMap[T]>;
      case ContentType.Video:
        return this.getDayVideo(day) as Observable<ContentTypeMap[T]>;
      case ContentType.St8ts:
        return this.getDayStr8ts(day) as Observable<ContentTypeMap[T]>;
      case ContentType.Podcast:
        return this.getDayPodcast(day) as Observable<ContentTypeMap[T]>;
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  }

  getDayStr8ts(dayNumber: number): Observable<Str8ts | undefined> {
    return this.http.get<Record<string, Str8ts>>(this.jsonUrlStr8tsContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }

  getDayGedicht(dayNumber: number): Observable<Gedicht | undefined> {
    return this.http.get<Record<string, Gedicht>>(this.jsonUrlGedichtContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }

  getDayRezept(dayNumber: number): Observable<Rezept | undefined> {
    return this.http.get<Record<string, Rezept>>(this.jsonUrlRezeptContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }

  getDayRaetsel(dayNumber: number): Observable<Raetsel | undefined> {
    return this.http.get<Record<string, Raetsel>>(this.jsonUrlRaetselUrl).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }

  getDayPodcast(dayNumber: number): Observable<Podcast | undefined> {
    return this.http.get<Record<string, Podcast>>(this.jsonUrlPodcastContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }

  getDayVideo(dayNumber: number): Observable<Video | undefined> {
    return this.http.get<Record<string, Video>>(this.jsonUrlVideoContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }
}
export interface WithBackground {
  background_path?: string;
  background_position?: string;
}

export interface ContentTypeMap {
  [ContentType.Gedicht]: Gedicht;
  [ContentType.Raetsel]: Raetsel;
  [ContentType.Rezept]: Rezept;
  [ContentType.Video]: Video;
  [ContentType.St8ts]: Str8ts;
  [ContentType.Podcast]: Podcast;
}

export enum ContentType {
  Gedicht = "Gedicht",
  Raetsel = "Raetsel",
  Rezept = "Rezept",
  Video = "Video",
  Snowforcast = "Snowforcast",
  St8ts = "Str8ts",
  Podcast = "Podcast"
}

export type Video = WithBackground & {
  titel: string,
  beschreibung: string,
  embedded_video: string,
  remark?: string
}

export type Podcast = WithBackground & {
  title: string,
  beschreibung: string,
  podcast_link: string,
  remark?: string
}

export type Str8ts = WithBackground & {
  titel: string,
  beschreibung: string,
  link: string
}

export type Raetsel = {
  frage: string,
  loesung: string,
  frage_bild_path: string,
  frage_bild_alt: string,
  loesung_bild_path: string,
  loesung_bild_alt: string
}

export type Gedicht = WithBackground & {
  titel: string,
  autor: string,
  gedicht: string
}

export type Rezept = WithBackground & {
  titel: string,
  link: string,
  zutaten: string,
  zubereitung: string
}
