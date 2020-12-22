import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../../classes/data-storage";

import { DesignReportCardServiceAdapter } from './design-report-card.service.adapter';
import { ReportCardService } from '@services/modules/report-card/report-card.service';

import { DesignReportCardHtmlAdapter } from './design-report-card.html.adapter';
import { DesignReportCardCanvasAdapter } from './design-report-card.canvas.adapter';

@Component({
  selector: 'app-design-report-card',
  templateUrl: './design-report-card.component.html',
  styleUrls: ['./design-report-card.component.css'],
  providers: [ReportCardService]
})
export class DesignReportCardComponent implements OnInit {
  user: any;
  canvas: any;

  currentLayout: any;
  ADD_LAYOUT_STRING = '<Add New Layout>';


  reportCardLayoutList: any[] = [];

  isLoading = false;

  serviceAdapter: DesignReportCardServiceAdapter;
  htmlAdapter: DesignReportCardHtmlAdapter;
  canvasAdapter: DesignReportCardCanvasAdapter;

  constructor(public reportCardService: ReportCardService,) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new DesignReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new DesignReportCardCanvasAdapter();

    this.htmlAdapter = new DesignReportCardHtmlAdapter();
    this.htmlAdapter.initializeAdapter(this);
  }

  populateCurrentLayoutWithEmptyDefaultData(): void {
    this.currentLayout = {
        parentSchool: this.user.activeSchool.dbId,
        name: '',
        content: [],
    };
  }

  populateCurrentLayoutWithGivenValue(value: any): void {
    // Check and give warning if the previous canvas is not saved

    if (this.canvas && this.canvasAdapter) {
      this.canvasAdapter.clearCanvas();
    }
    else {
      let observer = new MutationObserver((mutations, me) => {
        let canvas = document.getElementById('mainCanvas');
        if (canvas) {
          this.canvas = canvas;
          this.canvasAdapter.initilizeAdapter(this.canvas);
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }

    if (value === this.ADD_LAYOUT_STRING) {
      this.populateCurrentLayoutWithEmptyDefaultData();
    } else {
      this.currentLayout = { ...value, content: JSON.parse(value.content) };
      // Draw graphics on canvas from this.currentLayout.content
    }
    // Rest to be implemented
  }

}
