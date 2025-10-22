import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Gedicht} from "../content/day/day.component";

@Injectable({
  providedIn: 'root'
})
export class Content {
  private readonly jsonUrlGedichtContent = 'assets/content/text-content.json';
  private readonly jsonUrlContentTypMapping = 'assets/content/content-type-mapping.json';
  private readonly jsonUrlRaetselUrl = 'assets/content/raetsel-content.json'

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

  getDayRaetsel(dayNumber: number): Observable<Raetsel | undefined> {
    return this.http.get<Record<string, Raetsel>>(this.jsonUrlRaetselUrl).pipe(
      map(data => data[dayNumber] || undefined)
    );
  }
}

export enum ContentType {
  Gedicht = "Gedicht",
  Raetsel = "Raetsel"
}

export type Raetsel = {
  frage: string,
  loesung: string,
  frage_bild_path: string,
  frage_bild_alt: string,
  loesung_bild_path: string,
  loesung_bild_alt: string
}
