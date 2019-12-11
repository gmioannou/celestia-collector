import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  items: any
  message: any
  constructor(public popoverController: PopoverController) { 
    this.items = [
      {item: "Login"},
      {item: "About"},
      {item: "Exit"}
    ]
  }

  ngOnInit() {}

  itemClick(item) {
    this.popoverController.dismiss(item);
  }

}
