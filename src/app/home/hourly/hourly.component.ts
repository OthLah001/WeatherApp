import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TemperatureEnum, TimeEnum } from 'src/app/models/state.model';
import { THourlyWeather, decideDescription } from 'src/app/models/weather.model';

@Component({
  selector: 'app-hourly',
  templateUrl: 'hourly.component.html',
  styleUrls: ['hourly.component.scss'],
})
export class HourlyComponent implements OnInit{
  @Input() data: THourlyWeather;
  @Input() isMorning: boolean;
  @Input() temperature: TemperatureEnum;
  @Input() time: TimeEnum;

  @Output() changeCurrentWeather = new EventEmitter<any>();

  public selectedIndex = 0;
  public TemperatureEnum = TemperatureEnum;

  ngOnInit() {
    for (const d of this.data) {
        d.description = decideDescription(d.description, d.iconLetter);
    }
  }

  selectHour(index) {
    this.selectedIndex = index;
    this.changeCurrentWeather.emit({
        index,  description: this.data[index].description
    });
  }
}
