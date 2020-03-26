import { Component, OnInit } from '@angular/core';
import { Covid19Interface } from 'src/app/interfaces/covid19Interface';
import { Covid19Service } from 'src/app/service/covid19/covid19.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  totalCovidData: Covid19Interface = undefined;

  constructor(private covid19Service: Covid19Service) {}

  ngOnInit() {
    const interval = setInterval(() => {
      if (!this.covid19Service.fetchingData) {
        this.totalCovidData = this.covid19Service.totalCovidData;
        clearInterval(interval);
      }
    }, 200);
  }

}
