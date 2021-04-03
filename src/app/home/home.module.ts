import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from 'src/app/home/home.page';

import { HomePageRoutingModule } from 'src/app/home/home-routing.module';
import { HomeService } from 'src/app/home/home.services';
import { HeaderComponent } from 'src/app/home/header/header.component';
import { CurrentComponent } from 'src/app/home/current/current.component';
import { HourlyComponent } from 'src/app/home/hourly/hourly.component';
import { DailyComponent } from 'src/app/home/daily/daily.component';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DateTimePipeClass, TemperaturePipeClass, TimePipeClass, WindSpeedPipeClass } from './home.pipes';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    HomePage,
    HeaderComponent,
    CurrentComponent,
    HourlyComponent,
    DailyComponent,
    TemperaturePipeClass,
    WindSpeedPipeClass,
    TimePipeClass,
    DateTimePipeClass
  ],
  providers: [
    HomeService,
    OpenNativeSettings,
    AndroidPermissions,
    HttpClient
  ]
})
export class HomePageModule {}
