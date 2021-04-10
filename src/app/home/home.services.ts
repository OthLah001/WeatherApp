import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const OPEN_WEATEHR_MAP_KEY = ''; // https://home.openweathermap.org/api_keys
const LOCATION_IQ_KEY = ''; // https://my.locationiq.com/dashboard#accesstoken

@Injectable()
export class HomeService {
  constructor(
    private http: HttpClient
  ) { }

  getWeather(lat, lng): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=${OPEN_WEATEHR_MAP_KEY}`);
  }

  getLocalisationInfo(lat, lng): Observable<any> {
    return this.http.get(`https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_IQ_KEY}&lat=${lat}&lon=${lng}&format=json`);
  }
}
