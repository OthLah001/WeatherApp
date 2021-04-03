import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum, TemperatureEnum, TimeEnum } from 'src/app/models/state.model';
import { TDailyWeather, decideDescription } from 'src/app/models/weather.model';

@Component({
  selector: 'app-daily',
  templateUrl: 'daily.component.html',
  styleUrls: ['daily.component.scss'],
})
export class DailyComponent implements OnInit, OnChanges{
  @Input() data: TDailyWeather;
  @Input() temperature: TemperatureEnum;
  @Input() time: TimeEnum;
  @Input() language: LanguageEnum;

  public TemperatureEnum = TemperatureEnum;
  public LanguageEnum = LanguageEnum;

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
      for (const d of this.data) {
          d.description = decideDescription(d.description, 'n', true);
      }
  }

  ngOnChanges() {
    this.translateService.use(this.language || 'en');
  }
}
