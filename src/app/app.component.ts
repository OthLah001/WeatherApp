import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { State, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { IAppState, LanguageEnum } from './models/state.model';
import { Actions, States } from './store';
import { MenuController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public settings: IAppState = null;
  public LanguageEnum = LanguageEnum;

  constructor(
    private store: Store<any>,
    private translateService: TranslateService,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.translateService.setDefaultLang('en');

    this.platform.backButton.subscribe(async data => {
      if (!(await this.menu.isOpen())) {
        App.exitApp();
      }
    });
  }

  ngOnInit() {

    this.store.select(States.selectSettings).subscribe(
      settings => {
        this.settings = settings;
      }
    );
  }

  changeTemperature(value) {
    this.settings.temperature = value;
    this.store.dispatch(Actions.setTemperature({ payload: value }));
  }

  changeWindSpeed(value) {
    this.settings.windSpeed = value;
    this.store.dispatch(Actions.setWindSpeed({ payload: value }));
  }

  changeTime(value) {
    this.settings.time = value;
    this.store.dispatch(Actions.setTime({ payload: value }));
  }

  changeLanguage(value) {
    this.settings.language = value;
    this.translateService.use(this.settings.language || 'en');
    this.store.dispatch(Actions.setLanguage({ payload: value }));
  }

  refreshLocation() {
    this.store.dispatch(Actions.refreshLocation());
  }
}
