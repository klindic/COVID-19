import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private loading: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController) { }

  async presentLoading(msg: string) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      mode: 'ios',
      spinner: 'crescent'
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

}
