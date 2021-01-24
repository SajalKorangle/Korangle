import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarksLayer, Formula, Result, DEFAULT_PASSING_MARKS} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../pages/design-report-card/design-report-card.canvas.adapter';


@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: Result;

  marksLayers:(MarksLayer|Formula)[];
  newMarksLayer: MarksLayer|Formula = null;
  rules: { passingMarks: number[], remarks: string[], colorRule:any[]};

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.layer = data.layer;
    this.marksLayers = data.layer.marksLayers;
    this.rules = data.layer.rules;
    this.ca = data.ca;
   }

  ngOnInit() {
  }

  addToMarksLayer(): void{
    if (this.newMarksLayer) {
      let alreadyPresent: boolean = false;
      this.marksLayers.forEach((marksLayer: MarksLayer|Formula) => {
        if (marksLayer.id == this.newMarksLayer.id)
          alreadyPresent = true;
      });
      if (!alreadyPresent) {
        this.marksLayers.push(this.newMarksLayer);
        this.rules.remarks[this.marksLayers.length] = '';
        this.rules.colorRule[this.marksLayers.length] = '#000000';
        this.rules.passingMarks[this.marksLayers.length-1] = DEFAULT_PASSING_MARKS;
      }
    }
  }

  getRemarksLengthKeys(): any{
    return this.rules.remarks.map((e,i)=>i);
  }
  

}
