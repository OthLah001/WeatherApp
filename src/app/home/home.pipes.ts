import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { map } from "rxjs/operators";
import { LanguageEnum, TemperatureEnum, TimeEnum, WindSpeedEnum } from "../models/state.model";


@Pipe({
  name: 'temperaturePipe'
})
export class TemperaturePipeClass implements PipeTransform {
  transform(input: number, temperature: TemperatureEnum) {
    if (temperature === TemperatureEnum.Celsius) return input;
    else if (temperature === TemperatureEnum.Fahrenheit) return input * 1.8 + 32;
    else  return input + 273.15;
  }
}


@Pipe({
  name: 'windSpeedPipe'
})
export class WindSpeedPipeClass implements PipeTransform {
  transform(input: number, windSpeed: WindSpeedEnum) {
    if (windSpeed === WindSpeedEnum.MeterPerSec) return input;
    else return input * 2.237;
  }
}


@Pipe({
  name: 'timePipe'
})
export class TimePipeClass implements PipeTransform {
  transform(input: Date, time: TimeEnum) {
    if (time === TimeEnum.TwentyFourHours)  return moment(input).format('HH:mm');
    else  return moment(input).format('h:mm A');
  }
}


@Pipe({
  name: 'dateTimePipe'
})
export class DateTimePipeClass implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(input: Date, time: TimeEnum, language: LanguageEnum) {
    const month = moment(input).format('MMMM');
    const day = moment(input).format('DD');
    const year = moment(input).format('YYYY');
    const timeZ = moment(input).format(time === TimeEnum.TwentyFourHours ? 'HH:mm' : 'h:mm A');

    /* if (language === LanguageEnum.English) {
      return `${month} ${day} ${year}, ${timeZ}`;
    } else if (language === LanguageEnum.French) {
      
    } */
    return this.translate.get(month).pipe(
      map(mt => {
        if (language === LanguageEnum.English)  return `${mt} ${day} ${year}, ${timeZ}`;
        else if (language === LanguageEnum.French)  return `${day} ${mt} ${year}, ${timeZ}`;
        else if (language === LanguageEnum.Arabic)  return `${timeZ} ،${year} ${mt} ${day}`
      })
    );
  }
}