import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  http = inject(HttpClient);

  searchByCityName(city: string): Observable<CityResponseList> {
    return this.http.get<CityResponseList>(`https://geocoding-api.open-meteo.com/v1/search?name=` + city);
  }
}

export interface CityResponseList {
  results: CityResponse[];
}

export interface CityResponse {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string; //this is e.g. Bundesland
}
