import { Component, OnInit, ElementRef } from '@angular/core';
import { Covid19Interface } from 'src/app/interfaces/covid19Interface';
import { Covid19Service } from 'src/app/service/covid19/covid19.service';
import { formatViewDateTime } from 'src/app/utils/commonUtils';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  totalCovidData: Covid19Interface = undefined;
  dateTime: string;

  constructor(private covid19Service: Covid19Service,
              private elRef: ElementRef) {}

  ngOnInit() {
    const interval = setInterval(() => {
      if (!this.covid19Service.fetchingData) {
        this.setViewData();
        clearInterval(interval);
      }
    }, 200);
  }

  setViewData() {
    this.totalCovidData = this.covid19Service.totalCovidData;
    this.dateTime = formatViewDateTime(this.covid19Service.dateTimeFormatInUse);
  }

  async refreshData() {
    if (!this.covid19Service.fetchingData) {
      const refreshIcon = this.elRef.nativeElement.querySelector('ion-title ion-icon');
      refreshIcon.classList.add('refreshing');
      await this.covid19Service.ngOnInit();
      this.setViewData();
      refreshIcon.classList.remove('refreshing');
    }
  }

}
