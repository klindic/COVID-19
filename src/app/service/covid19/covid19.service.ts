import { Injectable, OnInit } from '@angular/core';
import { Covid19Interface } from 'src/app/interfaces/covid19Interface';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { formatDateTimeNumber, handleQuotes, getCalculatedData } from 'src/app/utils/commonUtils';
import { Covid19Model } from 'src/app/pages/tabs/tab2/tab2.model';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service implements OnInit {

  private _covidDataArray: Array<Covid19Interface> = new Array<Covid19Interface>();
  private _totalCovidData: Covid19Interface = new Covid19Model();

  fetchingData = true;
  noData = false;
  dateTimeFormatInUse: string;

  public get covidDataArray(): Array<Covid19Interface> {
    return this._covidDataArray;
  }
  public set covidDataArray(value: Array<Covid19Interface>) {
    this._covidDataArray = value;
  }

  public get totalCovidData(): Covid19Interface {
    return this._totalCovidData;
  }
  public set totalCovidData(value: Covid19Interface) {
    this._totalCovidData = value;
  }

  constructor(private _http: HTTP) {}

  async ngOnInit() {
    console.log('Covid19Service ngOnInit');
    const dayInMilliseconds = 86400000;
    const dateNow = Date.now() - dayInMilliseconds;
    const todayDate = new Date(dateNow);
    const yesterdayDate = new Date(dateNow - dayInMilliseconds);

    const todayDateTimeFormat = `${formatDateTimeNumber(todayDate.getMonth() + 1)}-${formatDateTimeNumber(todayDate.getDate())}-${todayDate.getFullYear()}`;
    const yesterdayDateTimeFormat = `${formatDateTimeNumber(yesterdayDate.getMonth() + 1)}-${formatDateTimeNumber(yesterdayDate.getDate())}-${yesterdayDate.getFullYear()}`;

    let url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${todayDateTimeFormat}.csv`;

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
      }
    }
  }

  async httpRequest(url: string) {
    const response = await this._http.get(url, {}, {});
    this.handleData(response);
  }

  handleData(response: HTTPResponse) {
    const covidDataArray: Array<string> = (response.data as string).split('\n');
    const covidHeaders: Array<string> = covidDataArray.splice(0, 1)[0].split(',');
    covidDataArray.forEach(covidData => {
      this.setCovidDataToArray(covidHeaders, covidData);
    });
    this.sortCovidData();
    this._totalCovidData = getCalculatedData(this._covidDataArray);
    this.fetchingData = false;
  }

  setCovidDataToArray(covidHeaders: Array<string>, covidDataString: string) {
    covidDataString = handleQuotes(covidDataString);
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

}
