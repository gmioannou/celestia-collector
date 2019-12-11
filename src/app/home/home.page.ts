import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonBottomDrawerModule, DrawerState } from 'ion-bottom-drawer';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Plugins, CameraResultType, CameraSource, SplashScreen } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapViewService } from '../services/map-view.service';
import { Platform, AlertController, PopoverController, ModalController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component'
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("map", { static: false }) mapEl: ElementRef;

  drawerState = DrawerState.Bottom;
  dockedHeight = 400;

  photoList: any[] = []
  photoListPreview: SafeResourceUrl[] = [];

  mapView: any;
  featureLayerField: any
  featureLayerDomain: any
  featureTypeSelected: any

  loading: boolean = false
  subscribe: any;

  // define events form
  eventForm: FormGroup = this.formBuilder.group({
    hazard_type: new FormControl(["", Validators.required]),
    description: new FormControl(""),
    longitude: new FormControl(""),
    latitude: new FormControl(""),
    altitude: new FormControl(""),
    accuracy: new FormControl(""),
  });

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private mapViewService: MapViewService,
    private platform: Platform,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private modalController: ModalController) { }

  ionViewDidEnter() {
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.exitApp()
    });
  }

  ionViewWillLeave() {
    this.subscribe.unsubscribe();
  }

  exitApp(){
    if (window.confirm("Are you sure you want to quit?")) {
      navigator["app"].exitApp();
    }
  }

  async presentPopover(ev: any) {
    let menuOption
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then(res => {
      menuOption = res.data['item']
      switch(menuOption) {
        case "Login":
          this.presentAlert("This feature is under development!")
          break;
        case "About":
          this.presentAlert(`
            <p>Developed by George Ioannou as part of master’s degree in Geoinformatics</p>             
            <p>Crowdsourcing Application for collecting data for Natural Hazard Events in the field</p>
            <p>&copy 2019, Cyprus University of Technology</p>`)          
          break;
        case "Exit":
          this.exitApp()
      }
    });

  }

  async ngOnInit() {

    // show splash screen
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });

    // get mapview
    try {
      this.loading = true

      let res = await this.mapViewService.getMapView()
      this.mapView = res
      this.mapView.container = this.mapEl.nativeElement
      console.log('Mapview initialized...');

      let laydesc = await this.mapViewService.getFetureLayerDescriptor()
      let renderer = laydesc.data.drawingInfo.renderer

      this.featureLayerField = renderer.field1
      this.featureLayerDomain = renderer.uniqueValueInfos

      this.featureLayerDomain.forEach(element => {
        element.isSelected = false
      });

      let copyrightElement = document.getElementsByClassName("esri-attribution__powered-by")
      copyrightElement[0].innerHTML = "&copy 2019, Cyprus University of Technology"

      // select the first element of the list
      this.selectFeatureType(this.featureLayerDomain[0])

      console.log('Layer descriptor initialized...');

    }
    catch (e) {
      console.log(e)
    }
    finally {
      this.loading = false
    }
  }

  // update form control based on user selection
  selectFeatureType(featureType) {
    this.eventForm.controls['hazard_type'].setValue(featureType.value);
    this.featureLayerDomain.forEach(element => {
      if (element == featureType) {
        element.isSelected = true
        this.featureTypeSelected = element
      }
      else element.isSelected = false
    });
  }

  // capture new event
  async captureEvent() {

    if (this.photoList.length == 0) {
      this.presentAlert("Please add pictures!")
      return
    }

    try {
      this.loading = true

      await this.mapViewService.captureEvent(this.eventForm, this.photoList)

      // reset event form and list of photos
      this.selectFeatureType(this.featureLayerDomain[0])
      this.eventForm.reset()
      this.photoList = []
      this.photoListPreview = []

      this.hideDrawer()

    }
    catch (e) {
      console.log(e)
    }
    finally {
      this.loading = false
    }

  }

  // take photos and place them in the attachments list
  async takePhoto() {
    const image = await Plugins.Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photoList.push(image);
    this.photoListPreview.push(this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl)));
  }

  // remove photo from the attachments list
  removePhoto(idx) {
    this.photoList.splice(idx, 1);
    this.photoListPreview.splice(idx, 1);
  }

  // show drawer (bottom sheet)
  showDrawer() {
    this.drawerState = DrawerState.Top
  }

  // hide drawer (bottom sheet)
  hideDrawer() {
    this.drawerState = DrawerState.Bottom
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
