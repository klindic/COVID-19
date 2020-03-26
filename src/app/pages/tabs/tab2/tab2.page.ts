import { Component, OnInit } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Covid19Interface } from 'src/app/interfaces/covid19Interface';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { Covid19Model } from './tab2.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  private _covidDataArray: Array<Covid19Interface> = new Array<Covid19Interface>();
  covidDataArrayView: Array<Covid19Interface> = new Array();

  fetchingData = true;
  noData = false;
  dateTimeFormatInUse: string;

  constructor(private http: HTTP,
              private helpers: HelpersService) {}

  async ngOnInit() {
    const dayInMilliseconds = 86400000;
    const dateNow = Date.now() - dayInMilliseconds;
    const todayDate = new Date(dateNow);
    const yesterdayDate = new Date(dateNow - dayInMilliseconds);

    const todayDateTimeFormat = `${this.formatDateTimeNumber(todayDate.getMonth() + 1)}-${this.formatDateTimeNumber(todayDate.getDate())}-${todayDate.getFullYear()}`;
    const yesterdayDateTimeFormat = `${this.formatDateTimeNumber(yesterdayDate.getMonth() + 1)}-${this.formatDateTimeNumber(yesterdayDate.getDate())}-${yesterdayDate.getFullYear()}`;

    let url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${todayDateTimeFormat}.csv`;

    await this.helpers.presentLoading('Loading data...');
    try {
      this.dateTimeFormatInUse = todayDateTimeFormat;
      await this.httpRequest(url);
    } catch (error) {
      console.log('No data for current day, fetching data for yesterday.');
      url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${yesterdayDateTimeFormat}.csv`;
      this.dateTimeFormatInUse = yesterdayDateTimeFormat;
      try {
        await this.httpRequest(url);
      } catch (error) {
        console.log('No data for yesterday. Stopping data fetching.', error);
        this.noData = true;
        await this.helpers.dismissLoading();
      }
    }
  }

  async httpRequest(url: string) {
    const response = await this.http.get(url, {}, {});
    this.handleData(response);
    await this.helpers.dismissLoading();
  }

  handleData(response: HTTPResponse) {
    const covidDataArray: Array<string> = (response.data as string).split('\n');
    const covidHeaders: Array<string> = covidDataArray.splice(0, 1)[0].split(',');
    covidDataArray.forEach(covidData => {
      this.setDataToArray(covidHeaders, covidData);
    });
    this.sortCovidData();
    this.covidDataArrayView = this._covidDataArray.sort((a, b) => Number(b.Confirmed) - Number(a.Confirmed)).slice(0, 20);
    this.fetchingData = false;
  }

  setDataToArray(covidHeaders: Array<string>, covidDataString: string) {
    covidDataString = this.handleQuotes(covidDataString);
    const covidDataArray = covidDataString.split(',');

    const covi19Model: Covid19Interface = new Covid19Model();

    for (const [index, header] of covidHeaders.entries()) {
      covi19Model[header] = covidDataArray[index] ? covidDataArray[index].replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '') : covidDataArray[index];
    }
    this._covidDataArray.push(covi19Model);
  }

  sortCovidData() {
    this._covidDataArray.sort((a, b) => (a.Country_Region === b.Country_Region) ? 0 : (a.Country_Region < b.Country_Region) ? -1 : 1 );
  }

  formatDateTimeNumber(num: number) {
    return String(num).length === 1 ? `0${num}` : String(num);
  }

  search(event: CustomEvent) {
    const value = (event.detail.value as string).toLowerCase();
    this.covidDataArrayView = value ?
      this._covidDataArray.filter(covidData => {
        return (covidData.Country_Region && covidData.Country_Region.toLowerCase().includes(value)) ||
          (covidData.Province_State && covidData.Province_State.toLowerCase().includes(value));
      }).slice(0, 20) : this._covidDataArray.slice(0, 20);
  }

  handleQuotes(covidDataString: string): string {
    const indexes = new Array();
    for (let i = 0; i < covidDataString.length; i++) {
      if (covidDataString[i] === '"') {
        indexes.push(i);
      }
    }
    if (indexes.length) {
      let startingIndex: number;
      let endingIndex: number;
      let stringBewteenChars: string;
      let replacedString: string;
      for (const [index, indexValue] of indexes.entries()) {
        if (index % 2) {
          endingIndex = indexValue + 1;
          stringBewteenChars = covidDataString.substring(startingIndex, endingIndex);
          replacedString = covidDataString.substring(startingIndex, endingIndex).replace(/["]/g, '').replace(/[,]/g, '.');
          covidDataString = covidDataString.replace(stringBewteenChars, replacedString);
        } else {
          startingIndex = indexValue;
        }
      }
    }
    return covidDataString;
  }

}
