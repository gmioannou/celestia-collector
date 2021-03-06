import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(public popoverController: PopoverController, 
    public authService: AuthService,
    private alertController:AlertController, 
    private navController: NavController) {
  }
  
  async ngOnInit() { 
    console.log(this.authService.login_user);
  }

  loginClick() {
    this.popoverController.dismiss();
    this.navController.navigateForward("/login")
  }

  logoutClick() {
    this.authService.logout();
    this.popoverController.dismiss();
    this.navController.navigateForward("/")
  }

  aboutClick() {
    this.presentAlert(`
      <p>Developed by George Ioannou as part of master’s degree in Geoinformatics.</p>             
      <p>Crowdsourcing Application for collecting data related to <strong>Natural Hazards</strong> in the field.</p>
      <p>&copy 2019, Cyprus University of Technology</p> Version 1.2`)
    this.popoverController.dismiss();

  }

  exitClick() {
    this.exitApp();
    this.popoverController.dismiss();
  }

  exitApp(){
    if (window.confirm("Are you sure you want to quit?")) {
      navigator["app"].exitApp();
    }
  }

  // present modal alert
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Celestia Collector',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
