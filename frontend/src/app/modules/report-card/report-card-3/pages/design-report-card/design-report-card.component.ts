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

  currentLayout: {id?:number, parentSchool:string, name:string, content: string};
  ADD_LAYOUT_STRING = '<Add New Layout>';

  // stores the layour list from backend, new layout or modified layout is added to this list only after saving to backend
  reportCardLayoutList: any[] = [];

  isLoading = false;

  serviceAdapter: DesignReportCardServiceAdapter;
  htmlAdapter: DesignReportCardHtmlAdapter;
  canvasAdapter: DesignReportCardCanvasAdapter;

  fileReader: FileReader;

  constructor(public reportCardService: ReportCardService,) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new DesignReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new DesignReportCardCanvasAdapter();

    this.htmlAdapter = new DesignReportCardHtmlAdapter();
    this.htmlAdapter.initializeAdapter(this);

    this.fileReader = new FileReader();
    this.fileReader.onload = e => {
      this.canvasAdapter.newImageLayer(this.fileReader.result); // Push new Image layer with the provided data
    };
  }

  newLayout(): void { // populating current layout to empty vaues and current activeSchool ID
    this.currentLayout = {
        parentSchool: this.user.activeSchool.dbId,
        name: '',
        content: '',
    };
  } 

  populateCurrentLayoutWithGivenValue(value: any): void {
    // Check and give warning if the previous canvas is not saved
    if (this.canvas) {
      this.canvasAdapter.clearCanvas();
    }
    else {
      // if canvs is not already rendered subscribe to mutations while canvas is rendered
      let observer = new MutationObserver((mutations, me) => {  
        let canvas = document.getElementById('mainCanvas');
        if (canvas) {
          this.canvas = canvas;
          this.htmlAdapter.canvasSetUp();
          this.canvasAdapter.initilizeAdapter(this.canvas);
          // Draw graphics of previous data form this.currentLayout.content
          me.disconnect();
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }

    if (value === this.ADD_LAYOUT_STRING) {
      this.newLayout();
    } else {
      this.currentLayout = { ...value, content: JSON.parse(value.content) };
      // Draw graphics on canvas from this.currentLayout.content
    }
    // Rest to be implemented
  }

  doesCurrentLayoutHasUniqueName(): boolean {
    return this.reportCardLayoutList.filter(reportCardLayout => {
        return reportCardLayout.name === this.currentLayout.name;
    }).length === 0;
  };

  imageUploadHandler(event: any): void{
    const uploadedImage = event.target.files[0];
    this.fileReader.readAsDataURL(uploadedImage);
  }

  resetCurrentLayout(): void {
    const layout = this.reportCardLayoutList.find(item => {
      return item.id === this.currentLayout.id;
    });
    this.populateCurrentLayoutWithGivenValue(layout === undefined ? this.ADD_LAYOUT_STRING : layout);
  }

  logMessage(msg: any): void{
    console.log("message: ", msg);
  }

}
