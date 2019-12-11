import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';

import { HomePage } from './home.page';
import { PopoverComponent } from '../popover/popover.component';
import { AboutComponent } from '../about/about.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonBottomDrawerModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, PopoverComponent, AboutComponent],
  entryComponents: [PopoverComponent, AboutComponent]
})
export class HomePageModule {}
