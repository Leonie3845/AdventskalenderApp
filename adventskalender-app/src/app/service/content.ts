import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Gedicht} from "../content/day/day.component";

@Injectable({
  providedIn: 'root'
})
export class Content {
  private readonly jsonUrl = 'assets/content/text-content.json';

  constructor(private http: HttpClient) {}

  getDayGedicht(dayNumber: number): Observable<Gedicht | undefined> {
    return this.http.get<Record<string, Gedicht>>(this.jsonUrl).pipe(
      map(data => data[dayNumber] || undefined)
    );

  }
}
