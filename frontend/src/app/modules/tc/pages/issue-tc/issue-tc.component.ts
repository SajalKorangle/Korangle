import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";

@Component({
  selector: 'app-issue-tc',
  templateUrl: './issue-tc.component.html',
  styleUrls: ['./issue-tc.component.css']
})
export class IssueTCComponent implements OnInit {

  user: any;

  isLoading = false;


  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
