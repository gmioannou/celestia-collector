import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonBottomDrawerModule, DrawerState } from 'ion-bottom-drawer';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MapViewService } from '../services/map-view.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("map", { static: false }) mapEl: ElementRef;

  drawerState = 0;
  dockedHeight = 400;

  photoList: any[] = []
  photoListPreview: SafeResourceUrl[] = [];

  mapView: any;
  featureLayerField: any
  featureLayerDomain: any
  featureTypeSelected: any

  loading: boolean = false
  subscribe: any;

  constructor(
    private formBuilder: FormBuilder, 
    private sanitizer: DomSanitizer, 
    private mapViewService: MapViewService, 
    private platform: Platform) 
  {
    this.subscribe = this.platform.backButton.subscribeWithPriority(66666, () => {
      if (this.constructor.name == "MapViewerPage") {
        if (window.confirm("Are you sure you want to quit Cyclops Collector?")){
          navigator["app"].exitApp();
        }
      }  
    })
  }

  async ngOnInit() {

    // get mapview
    try {
      this.loading = true
      this.mapViewService.delay(20000)

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

  // form for capturing new events
  eventForm: FormGroup = this.formBuilder.group({
    hazard_type: new FormControl(""),
    description: new FormControl(""),
    longitude: new FormControl(""),
    latitude: new FormControl(""),
    altitude: new FormControl(""),
    accuracy: new FormControl(""),
  });

  // update form control based on user selection
  selectFeatureType(featureType) {
    this.eventForm.controls['hazard_type'].setValue(featureType.value);
    this.featureLayerDomain.forEach(element => {
      if (element == featureType){
        element.isSelected = true
        this.featureTypeSelected = element
      }
      else element.isSelected = false
    });

  }

  // capture new event
  async captureEvent() {

    try {
      this.loading = true

      await this.mapViewService.captureEvent(this.eventForm, this.photoList)
      
      // reset event form and list of photos
      this.eventForm.reset()
      this.photoList = []
      this.photoListPreview = []

      this.toggleDrawerState()

    }
    catch (e) {
      console.log(e)
    }
    finally {
      this.loading = false
    }

  }

  // take photo for attachement
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

  removePhoto(idx) {
    this.photoList.splice(idx, 1);
    this.photoListPreview.splice(idx, 1);
  }

  // show/hide drawer (bottom sheet)
  toggleDrawerState() {
    if (this.drawerState == DrawerState.Bottom)
      this.drawerState = DrawerState.Docked
    else
      this.drawerState = DrawerState.Bottom
  }

}
