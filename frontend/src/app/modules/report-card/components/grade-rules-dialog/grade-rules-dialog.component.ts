import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradeRule} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../report-card-3/pages/design-report-card/design-report-card.canvas.adapter';

@Component({
  selector: 'app-grade-rules-dialog',
  templateUrl: './grade-rules-dialog.component.html',
  styleUrls: ['./grade-rules-dialog.component.css']
})
export class GradeRulesDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  gradeRules: Array<GradeRule>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) { 
    this.ca = data.ca;
    this.gradeRules = this.ca.gradeRules;
  }

  ngOnInit() {
  }

  addNewGradeRule() {
    this.gradeRules.push(new GradeRule());
  }

  getGradeRulesKeys(): Array<number>{
    return this.gradeRules.map((e, i) => i);
  }

}
