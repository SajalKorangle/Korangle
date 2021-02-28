import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'app-design-tc',
  templateUrl: './design-tc.component.html',
  styleUrls: ['./design-tc.component.css']
})
export class DesignTCComponent implements OnInit {

  user: any;

  isLoading = false;

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }
  
}
