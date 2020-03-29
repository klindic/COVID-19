import { Injectable } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router,
              private navCtrl: NavController,
              private route: ActivatedRoute) { }

    async navigate(commands: any[], params: any, extras: NavigationExtras = {}) {
      extras.state = params;
      await this.router.navigate(commands, extras);
    }

    async pop() {
      this.navCtrl.pop();
    }

    async getParams(): Promise<any>  {
      return new Promise((resolve, reject) => {
        const queryParams = this.route.queryParams.subscribe(params => {
          const state = this.router.getCurrentNavigation().extras.state;
          resolve(state);
        });
        queryParams.unsubscribe();
      });
    }

}
