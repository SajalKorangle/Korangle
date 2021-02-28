import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";

@Component({
  selector: 'app-regenerate-tc',
  templateUrl: './regenerate-tc.component.html',
  styleUrls: ['./regenerate-tc.component.css']
})
export class RegenerateTCComponent implements OnInit {

  user: any;

  isLoading = false;


  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
