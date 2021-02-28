import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";

@Component({
  selector: 'app-generate-tc',
  templateUrl: './generate-tc.component.html',
  styleUrls: ['./generate-tc.component.css']
})
export class GenerateTCComponent implements OnInit {
  
  user: any;

  isLoading = false;


  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
