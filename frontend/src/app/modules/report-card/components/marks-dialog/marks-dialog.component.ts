import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MarksLayer, GradeRule} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../report-card-3/pages/design-report-card/design-report-card.canvas.adapter';

@Component({
  selector: 'app-marks-dialog',
  templateUrl: './marks-dialog.component.html',
  styleUrls: ['./marks-dialog.component.css']
})
export class MarksDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: MarksLayer;
  layerGradeRules: Array<GradeRule>;
  newGradeRule: GradeRule;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.ca = data.ca;
    this.layer = data.layer;
    this.layerGradeRules = this.layer.gradeRules;
  }

  ngOnInit() {
  }

  addGradeRule():void {
    if (this.layerGradeRules.findIndex(g => g.ruleDisplayName == this.newGradeRule.ruleDisplayName) == -1) {
      this.layerGradeRules.push(this.newGradeRule);
    }
  }

  removeGradeRule(index: number): void{
    this.layerGradeRules.splice(index, 1);
  }

}
