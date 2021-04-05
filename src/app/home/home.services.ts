import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class HomeService {
  constructor(
    private http: HttpClient
  ) { }

  getWeather(lat, lng): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=de2e7cf0d58aea6494c33515039b1315`);
  }

  getLocalisationInfo(lat, lng): Observable<any> {
    return this.http.get(`https://us1.locationiq.com/v1/reverse.php?key=19382964dbc382&lat=${lat}&lon=${lng}&format=json`);
  }
}
