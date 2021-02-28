import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'app-tc-logbook',
  templateUrl: './tc-logbook.component.html',
  styleUrls: ['./tc-logbook.component.css']
})
export class TCLogbookComponent implements OnInit {

  user: any;

  isLoading = false;

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
