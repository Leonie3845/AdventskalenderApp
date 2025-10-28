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
  private readonly jsonUrlVideoContent = 'assets/content/video-content.json'


  constructor(private http: HttpClient) {
  }

  getTypeOfDay(dayNumber: number): Observable<ContentType> {
    return this.http.get<Record<string, ContentType>>(this.jsonUrlContentTypMapping).pipe(
      map(data => data[dayNumber])
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
  getDayVideo(dayNumber: number): Observable<Video | undefined> {
    return this.http.get<Record<string, Video>>(this.jsonUrlVideoContent).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }
}


export enum ContentType {
  Gedicht = "Gedicht",
  Raetsel = "Raetsel",
  Rezept = "Rezept",
  Video = "Video"
}

export type Video = {
  titel: string,
  beschreibung: string,
  embedded_video: string,
  background_path?: string
  background_position?: string
}

export type Raetsel =  {
  frage: string,
  loesung: string,
  frage_bild_path: string,
  frage_bild_alt: string,
  loesung_bild_path: string,
  loesung_bild_alt: string
}

export type Gedicht =  {
  titel: string,
  autor: string,
  gedicht: string,
  background_path?: string
  background_position?: string
}

export type Rezept = {
  titel: string,
  link: string,
  zutaten: string,
  zubereitung: string,
  background_path?: string
  background_position?: string
}
