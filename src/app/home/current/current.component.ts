import { Component, Input, OnChanges } from '@angular/core';
import { IAppState, TemperatureEnum, WindSpeedEnum } from 'src/app/models/state.model';
import { CurrentWeather, decideDescription } from 'src/app/models/weather.model';

@Component({
  selector: 'app-current',
  templateUrl: 'current.component.html',
  styleUrls: ['current.component.scss'],
})
export class CurrentComponent implements OnChanges{
  @Input() data: CurrentWeather;
  @Input() isMorning: boolean;
  @Input() temperature: TemperatureEnum;
  @Input() windSpeed: WindSpeedEnum;

  public TemperatureEnum = TemperatureEnum;

  ngOnChanges() {
    this.data.description = decideDescription(this.data.description, this.isMorning ? 'd' : 'n', this.isMorning);
  }
}
