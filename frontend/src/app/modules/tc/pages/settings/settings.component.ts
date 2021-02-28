import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: any;

  isLoading = false;

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
