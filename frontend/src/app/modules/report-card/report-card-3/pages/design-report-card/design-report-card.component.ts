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

  currentLayout: {id?:any, parentSchool:string, name:string, content: any};
  ADD_LAYOUT_STRING = '<Add New Layout>';

  // stores the layour list from backend, new layout or modified layout is added to this list only after saving to backend
  reportCardLayoutList: any[] = [];

  unuploadedFiles: {string:string}[] = []; // Local urls of files to be uploaded, format [{file_uri : file_name},...]

  serviceAdapter: DesignReportCardServiceAdapter;
  htmlAdapter: DesignReportCardHtmlAdapter = new DesignReportCardHtmlAdapter();
  canvasAdapter: DesignReportCardCanvasAdapter;

  fileReader: FileReader;

  constructor(public reportCardService: ReportCardService,) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new DesignReportCardServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();

    this.canvasAdapter = new DesignReportCardCanvasAdapter();

    this.htmlAdapter.initializeAdapter(this);
  }

  newLayout(): void { // populating current layout to empty vaues and current activeSchool ID
    this.currentLayout = {
        parentSchool: this.user.activeSchool.dbId,
        name: '',
        content: [],
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
    console.log('curent Layout: ', this.currentLayout);
  }

  doesCurrentLayoutHasUniqueName(): boolean {
    return this.reportCardLayoutList.filter(reportCardLayout => {
      return this.currentLayout.id !== reportCardLayout.id
        && reportCardLayout.name === this.currentLayout.name;
    }).length === 0;
  };

  imageUploadHandler(event: any): void{
    const uploadedImage = event.target.files[0];
    const local_file_uri = URL.createObjectURL(uploadedImage);
    this.canvasAdapter.newImageLayer(local_file_uri); // Push new Image layer with the provided data
    this.unuploadedFiles[local_file_uri] = uploadedImage.name;
  }

  resetCurrentLayout(): void {
    const layout = this.reportCardLayoutList.find(item => {
      return item.id === this.currentLayout.id;
    });
    this.populateCurrentLayoutWithGivenValue(layout === undefined ? this.ADD_LAYOUT_STRING : layout);
  }

  async saveLayout() {
    if (this.currentLayout.name.trim() == '') {
      await window.confirm("Layout Name Cannot Be Empty!");
      this.htmlAdapter.isSaving = false;
      return;
    }

    if (!this.currentLayout.id) // if new layout upload it
      await this.serviceAdapter.uploadCurrentLayout();
    
    const layers = this.canvasAdapter.getLayersToSave();
    console.log('to be uploaded layers = ', layers);
    for (let i = 0; i < layers.length;i++){
      if (layers[i].LAYER_TYPE == 'IMAGE') {
        if (this.unuploadedFiles[layers[i].uri]) {
          let image = await fetch(layers[i].uri).then(response => response.blob());
          console.log(image)
          layers[i].image = await this.serviceAdapter.uploadImageForCurrentLayout(image, this.unuploadedFiles[layers[i].uri]);
          console.log('image url = ', layers[i].image);
        }
      }
    }
    this.currentLayout.content = layers;
    await this.serviceAdapter.uploadCurrentLayout();
    
    this.htmlAdapter.isSaving = false;
  }

  logMessage(msg: any): void{
    console.log("message: ", msg);
  }

}
