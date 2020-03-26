import { Component, OnInit } from '@angular/core';
import { Covid19Interface } from 'src/app/interfaces/covid19Interface';
import { Covid19Service } from 'src/app/service/covid19/covid19.service';
import { formatViewDateTime } from 'src/app/utils/commonUtils';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  covidDataArrayView: Array<Covid19Interface> = new Array();
  dateTime: string;

  dummyArray: Array<number> = new Array(20).fill(1);

  constructor(public covid19Service: Covid19Service) {}

  async ngOnInit() {
    const interval = setInterval(() => {
      if (!this.covid19Service.fetchingData) {
        this.setViewData();
        clearInterval(interval);
      }
    }, 200);
  }

  setViewData() {
    this.covidDataArrayView = this.covid19Service.covidDataArray.sort((a, b) => Number(b.Confirmed) - Number(a.Confirmed)).slice(0, 20);
    this.dateTime = formatViewDateTime(this.covid19Service.dateTimeFormatInUse);
  }

  search(event: CustomEvent) {
    const value = (event.detail.value as string).toLowerCase();
    this.covidDataArrayView = value ?
      this.covid19Service.covidDataArray.filter(covidData => {
        return (covidData.Country_Region && covidData.Country_Region.toLowerCase().includes(value)) ||
          (covidData.Province_State && covidData.Province_State.toLowerCase().includes(value));
      }).slice(0, 20) : this.covid19Service.covidDataArray.slice(0, 20);
  }

}
