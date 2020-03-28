import { Component, ElementRef } from '@angular/core';
import { CoronavirusService } from 'src/app/services/coronavirus/coronavirus.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public coronavirusService: CoronavirusService,
              private elRef: ElementRef) {}

  async refreshData() {
    if (!this.coronavirusService.fetchingData) {
      const refreshIcon = this.elRef.nativeElement.querySelector('ion-title ion-icon');
      refreshIcon.classList.add('refreshing');
      await this.coronavirusService.ngOnInit();
      refreshIcon.classList.remove('refreshing');
    }
  }

}
