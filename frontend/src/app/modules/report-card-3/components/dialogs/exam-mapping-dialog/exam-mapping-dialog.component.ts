import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DesignReportCardCanvasAdapter } from '../../../pages/design-report-card/design-report-card.canvas.adapter';

@Component({
  selector: 'app-exam-mapping-dialog',
  templateUrl: './exam-mapping-dialog.component.html',
  styleUrls: ['./exam-mapping-dialog.component.css']
})
export class ExamMappingDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  examMappedByLayoutExamName: { [key: string]: number } = {}

  constructor(public dialogRef: MatDialogRef<ExamMappingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) { 
    this.ca = data.ca;
  }

  ngOnInit() {
    this.ca.layers.forEach(layer => {
      switch (layer.LAYER_TYPE) {
        case 'MARKS':
        case 'REMARK':
        case 'GRADE':
          if (layer.examinationName) {
            this.examMappedByLayoutExamName[layer.examinationName] =  undefined;
          }
          break;
      }
    })
  }

  getLayoutExaminationNames(): Array<any>{
    return Object.keys(this.examMappedByLayoutExamName);
  }

  getExaminationList(): Array<any>{
    return this.ca.DATA.data.examinationList;
  }

  apply() {
    this.dialogRef.close({ ...this.examMappedByLayoutExamName });
  }

}
