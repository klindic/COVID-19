import { Component, OnInit, ElementRef } from '@angular/core';
import { CoronavirusService } from 'src/app/services/coronavirus/coronavirus.service';
import { formatDateTimeNumber } from 'src/app/utils/commonUtils';
import { CoronavirusModel } from 'src/app/models/coronavirusModel';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  covidDataArrayView: Array<CoronavirusModel> = new Array();

  dummyArray: Array<number> = new Array(20).fill(1);

  constructor(public coronavirusService: CoronavirusService,
              private elRef: ElementRef) {}

  async ngOnInit() {
    const interval = setInterval(() => {
      if (!this.coronavirusService.fetchingData) {
        this.setViewData();
        clearInterval(interval);
      }
    }, 200);
  }

  setViewData() {
    this.covidDataArrayView = this.coronavirusService.coronavirusData.slice(0, 20);
  }

  search(event: CustomEvent) {
    const value = (event.detail.value as string).toLowerCase();
    this.covidDataArrayView = value ?
      this.coronavirusService.coronavirusData.filter(covidData => {
        covidData.country.toLowerCase().includes(value);
      }).slice(0, 20) : this.coronavirusService.coronavirusData.slice(0, 20);
  }

  async refreshData() {
    if (!this.coronavirusService.fetchingData) {
      const refreshIcon = this.elRef.nativeElement.querySelector('ion-title ion-icon');
      refreshIcon.classList.add('refreshing');
      await this.coronavirusService.ngOnInit();
      this.setViewData();
      refreshIcon.classList.remove('refreshing');
    }
  }

}
