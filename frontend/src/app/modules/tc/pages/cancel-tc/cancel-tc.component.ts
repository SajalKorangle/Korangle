import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";

@Component({
  selector: 'app-cancel-tc',
  templateUrl: './cancel-tc.component.html',
  styleUrls: ['./cancel-tc.component.css']
})
export class CancelTCComponent implements OnInit {

  user: any;

  isLoading = false;


  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
