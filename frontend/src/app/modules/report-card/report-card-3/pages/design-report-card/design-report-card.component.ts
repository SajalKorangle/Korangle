import { Component, OnInit } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";

@Component({
  selector: 'app-design-report-card',
  templateUrl: './design-report-card.component.html',
  styleUrls: ['./design-report-card.component.css']
})
export class DesignReportCardComponent implements OnInit {
  user: any;
  isLoading = false;

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
