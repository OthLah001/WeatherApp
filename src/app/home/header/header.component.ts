import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LanguageEnum, TimeEnum } from 'src/app/models/state.model';
import { HeaderWeather } from 'src/app/models/weather.model';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnChanges {
  @Input() data: HeaderWeather;
  @Input() time: TimeEnum;
  @Input() language: LanguageEnum;

  public templateLanguage: LanguageEnum;

  public LanguageEnum = LanguageEnum;

  constructor(
    private menu: MenuController
  ) { }

  ngOnChanges() {
    setTimeout(() => {
      this.templateLanguage = this.language;
    })
  }

  openMenu() {
    this.menu.enable(true, 'myMenu');
    this.menu.open('myMenu');
  }
}
