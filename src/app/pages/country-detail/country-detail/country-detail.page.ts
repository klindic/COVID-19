import { Component, OnInit } from '@angular/core';
import { CoronavirusModel } from 'src/app/models/coronavirusModel';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.page.html',
  styleUrls: ['./country-detail.page.scss'],
})
export class CountryDetailPage implements OnInit {

  covidData: CoronavirusModel;

  constructor(private nav: NavigationService) { }

  async ngOnInit() {
    const params = await this.nav.getParams();
    this.covidData = params && params.covidData ? params.covidData : undefined;
    console.log(this.covidData);
  }

}
