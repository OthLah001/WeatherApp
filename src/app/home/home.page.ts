import { Component } from '@angular/core';
import { ViewDidEnter, AlertController } from '@ionic/angular';
import { HomeService } from 'src/app/home/home.services';
import { forkJoin, Subscription } from 'rxjs';
import { CurrentWeather, HeaderWeather, THourlyWeather, TDailyWeather } from 'src/app/models/weather.model';
import * as moment from 'moment';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { IAppState, LanguageEnum, TemperatureEnum, TimeEnum, WindSpeedEnum } from '../models/state.model';
import { Store } from '@ngrx/store';
import { Actions, States } from '../store';
import { Actions as eActions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';


const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ViewDidEnter {

  constructor(
    private homeService: HomeService,
    private alertController: AlertController,
    private openNativeSettings: OpenNativeSettings,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    private store: Store<any>,
    private actions$: eActions,
    private translate: TranslateService
  ) {
    HomePage._this = this;
  }

  // tslint:disable-next-line: variable-name
  static _this;

  private weather: any;
  private localisation: any;

  public header: HeaderWeather;
  public current: CurrentWeather;
  public hourly: THourlyWeather = [];
  public daily: TDailyWeather = [];

  public isMorning = true;
  public dataLoaded = false;
  public showRetryBtn = false;

  public settings: IAppState = {
    temperature: TemperatureEnum.Celsius,
    windSpeed: WindSpeedEnum.MeterPerSec,
    time: TimeEnum.TwentyFourHours,
    language: LanguageEnum.English
  };

  private subs: Subscription = new Subscription();

  async ionViewDidEnter(isRefresh = false) {
    this.dataLoaded = false;

    if (!isRefresh) {
      const settings = JSON.parse(await this.storage.get('settings'));
      if (settings) {
        this.settings = settings;
        this.store.dispatch(Actions.setTemperature({ payload: this.settings.temperature }));
        this.store.dispatch(Actions.setWindSpeed({ payload: this.settings.windSpeed }));
        this.store.dispatch(Actions.setTime({ payload: this.settings.time }));
        this.store.dispatch(Actions.setLanguage({ payload: this.settings.language }));

        this.translate.use(this.settings.language || 'en');
      } else {
        await this.storage.set('settings', JSON.stringify(this.settings));
      }
    }

    const networkStatus = await Network.getStatus();
    if (networkStatus.connected) {
      navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.getStoredPosition, { timeout: 3000 });
    } else {
      const header$ = this.translate.get('No Internet Network');
      const message$ = this.translate.get('Please connect your phone to an internet network in order to benefit all our features.')
      const activeWifiBtn$ = this.translate.get('Enable Wi-fi');
      const tryAgainBtn$ = this.translate.get('TRY AGAIN');

      forkJoin({
        header: header$,
        message: message$,
        activeWifiBtn: activeWifiBtn$,
        tryAgainBtn: tryAgainBtn$
      }).subscribe(data => {
        const buttons = [
          {
            text: data.activeWifiBtn,
            handler: () => {
              this.showRetryBtn = true;
              this.openNativeSettings.open('wifi');
            }
          },
          {
            text: data.tryAgainBtn,
            handler: () => {
              HomePage._this.ionViewDidEnter();
            }
          }
        ];

        this.openPopup(data.header, data.message, buttons);
      });
    }

    if (!isRefresh) {
      this.store.select(States.selectTemperature).subscribe(
        temperature => {
          this.settings.temperature = temperature;
          this.storeSettings();
        }
      );

      this.store.select(States.selectWindSpeed).subscribe(
        windSpeed => {
          this.settings.windSpeed = windSpeed;
          this.storeSettings();
        }
      );

      this.store.select(States.selectTime).subscribe(
        time => {
          this.settings.time = time;
          this.storeSettings();
        }
      );

      this.store.select(States.selectLanguage).subscribe(
        language => {
          this.settings.language = language;
          this.storeSettings();
        }
      );

      this.actions$.pipe(
        ofType(Actions.refreshLocation)
      ).subscribe(() => this.ionViewDidEnter(true));
    }
  }

  async storeSettings() {
    await this.storage.remove('settings');
    await this.storage.set('settings', JSON.stringify(this.settings));
  }

  geolocationSuccess(position: any) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    HomePage._this.storePosition(lat, lng);

    forkJoin({
      weather: HomePage._this.homeService.getWeather(lat, lng),
      localisation: HomePage._this.homeService.getLocalisationInfo(lat, lng)
    }).subscribe(
      data => {
        HomePage._this.weather = data.weather;
        HomePage._this.localisation = data.localisation;

        HomePage._this.initWeather();
      },
      err => {
        const header = 'Request Error';
        const message = 'Cannot fetch information from the server.';
        const buttons = [{
          text: 'TRY AGAIN',
          handler: () => {
            HomePage._this.ionViewDidEnter();
          }
        }];

        HomePage._this.openPopup(header, message, buttons);
      }
    );
  }

  geolocationError(error) {
    // tslint:disable-next-line: one-variable-per-declaration
    let header, message, buttons;

    const header$ = this.translate.get(error.code === 1 ? 'Cannot access location in your phone' : 'Timeout Expired');
    const message$ = this.translate.get(error.code === 1 ? 'Please allow location permission for the app to benefit all our features.' : 'Cannot get your location\'s information.');
    const activeLocationBtn$ = this.translate.get('Enable Location');
    const tryAgainBtn$ = this.translate.get('TRY AGAIN');

    forkJoin({
      header: header$,
      message: message$,
      activeLocationBtn: activeLocationBtn$,
      tryAgainBtn: tryAgainBtn$
    }).subscribe(data => {
      const buttons = [];
      if (error.code !== 1) buttons.push({
        text: data.activeLocationBtn,
        handler: () => {
          this.showRetryBtn = true;
          this.openNativeSettings.open('location');
        }
      });

      buttons.push({
        text: data.tryAgainBtn,
        handler: () => {
          this.ionViewDidEnter();
        }
      });

      this.openPopup(data.header, data.message, buttons);
    });
  }

  retry() {
    this.showRetryBtn = false;
    this.ionViewDidEnter();
  }

  async openPopup(header, message, buttons) {
    const alertPopup = await this.alertController.create({
      cssClass: this.settings.language === LanguageEnum.Arabic ? 'alert-popup-ar' : '',
      header,
      message,
      buttons
    });

    await alertPopup.present();
  }

  initWeather() {
    this.setHeaderWeather();
    this.setCurrentWeather();
    this.setHourlyWeather();
    this.setDailyWeather();
    this.setSunState();

    this.dataLoaded = true;
  }

  setHeaderWeather() {
    this.header = {
      city: this.localisation.address.city ? this.localisation.address.city : this.localisation.address.town,
      dateTime: new Date(moment.unix(this.weather.current.dt).format())
    };
  }

  setCurrentWeather() {
    this.current = {
      description: this.weather.current.weather[0].description,
      temp: this.weather.current.temp,
      humidity: this.weather.current.humidity,
      windSpeed: this.weather.current.wind_speed,
      windDeg: this.weather.current.wind_deg
    };
  }

  setHourlyWeather() {
    for (let index = 0; index < 24; index++) {
      this.hourly.push({
        time: new Date(moment.unix(this.weather.hourly[index].dt).format()),
        description: this.weather.hourly[index].weather[0].description,
        temp: this.weather.hourly[index].temp,
        iconLetter: this.weather.hourly[index].weather[0].icon.substr(-1)
      });
    }
  }

  setDailyWeather() {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.weather.daily.length; index++) {
      this.daily.push({
        day: new Date(moment.unix(this.weather.daily[index].dt).format()),
        description: this.weather.daily[index].weather[0].description,
        tempMax: this.weather.daily[index].temp.max,
        tempMin: this.weather.daily[index].temp.min,
        sunrise: new Date(moment.unix(this.weather.daily[index].sunrise).format()),
        sunset: new Date(moment.unix(this.weather.daily[index].sunset).format())
      });
    }
  }

  setSunState() {
    this.isMorning = moment().isAfter(moment.unix(this.weather.daily[0].sunrise)) && moment().isBefore(moment.unix(this.weather.daily[0].sunset));
  }

  changeCurrentWeather(data: any) {
    const weather = this.weather.hourly[data.index];
    this.current = {
      temp: weather.temp,
      humidity: weather.humidity,
      windSpeed: weather.wind_speed,
      windDeg: weather.wind_deg,
      description: data.description
    };
  }

  async storePosition(lat, lng) {
    await this.storage.remove('lat');
    await this.storage.remove('lng');

    await this.storage.set('lat', lat);
    await this.storage.set('lng', lng);
  }

  async getStoredPosition(error) {
    const keys = await HomePage._this.storage.keys();

    if (keys.includes('lat') && keys.includes('lng')) {
      const position = {
        coords: {
          latitude: await HomePage._this.storage.get('lat'),
          longitude: await HomePage._this.storage.get('lng')
        }
      };

      HomePage._this.geolocationSuccess(position);
    } else {
      HomePage._this.geolocationError(error);
    }
  }

}
