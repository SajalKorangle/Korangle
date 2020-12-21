import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../../classes/data-storage";
import {DesignReportCardServiceAdapter } from './design-report-card.service.adapter';

@Component({
  selector: 'app-design-report-card',
  templateUrl: './design-report-card.component.html',
  styleUrls: ['./design-report-card.component.css']
})
export class DesignReportCardComponent implements OnInit {
  user: any;

  isLoading = false;

  serviceAdapter: DesignReportCardServiceAdapter

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new DesignReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

}
