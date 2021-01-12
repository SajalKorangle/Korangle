import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarksLayer, CUSTOM_VARIABLE_TYPES, Result} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../report-card-3/pages/design-report-card/design-report-card.canvas.adapter';


@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: Result;

  marksLayers:MarksLayer[];
  newMarksLayer: MarksLayer = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.layer = data.layer;
    this.marksLayers = data.layer.marksLayers;
    this.ca = data.ca;
   }

  ngOnInit() {
  }

  addToMarksLayer(): void{
    if (this.newMarksLayer) {
      let alreadyPresent: boolean = false;
      this.marksLayers.forEach((marksLayer: MarksLayer) => {
        if (marksLayer.id == this.newMarksLayer.id)
          alreadyPresent = true;
      });
      if (!alreadyPresent) {
        this.marksLayers.push(this.newMarksLayer);
      }
    }
  }
  

}
