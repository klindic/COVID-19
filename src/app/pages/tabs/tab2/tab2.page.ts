import { Component, OnInit, ElementRef } from '@angular/core';
import { CoronavirusService } from 'src/app/services/coronavirus/coronavirus.service';
import { CoronavirusModel } from 'src/app/models/coronavirusModel';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  covidDataArrayView: Array<CoronavirusModel> = new Array();

  dummyArray: Array<number> = new Array(10).fill(1);

  itemsCounter: number;
  scrollLoadingDisabled: boolean;

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
    this.covidDataArrayView = this.coronavirusService.coronavirusData.slice(0, 10);
    this.itemsCounter = 10;
    this.scrollLoadingDisabled = false;
  }

  search(event: CustomEvent) {
    const value = (event.detail.value as string).toLowerCase();
    this.covidDataArrayView = value ?
      this.coronavirusService.coronavirusData.filter(covidData =>
          covidData.country.toLowerCase().includes(value)
        ).slice(0, 20) : this.coronavirusService.coronavirusData.slice(0, 10);
    this.itemsCounter = 10;
    this.scrollLoadingDisabled = value ? true : false;
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

  logScrolling($event: CustomEvent) {
    if (!this.scrollLoadingDisabled && this.itemsCounter < this.coronavirusService.coronavirusData.length) {
      try {
        const containerHeight = document.getElementById('container').offsetHeight;
        const ionContentHeight = ($event.target as HTMLElement).offsetHeight;
        const maxScrollTop = containerHeight - ionContentHeight;
        const spinnerMargin = 5;
        if ($event.detail.scrollTop >= maxScrollTop - spinnerMargin) {
          this.loadMoreData();
        }
      } catch (error) {
        // swallow as container probably isn't rendered
      }
    }
  }

  loadMoreData() {
    console.log('loading more data...');
    // show spinner for a quarter a second
    setTimeout(() => {
      this.itemsCounter += 10;
      this.covidDataArrayView = this.coronavirusService.coronavirusData.slice(0, this.itemsCounter);
    }, 250);
  }

}
