import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MarksLayer} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../pages/design-report-card/design-report-card.canvas.adapter';

@Component({
  selector: 'app-marks-dialog',
  templateUrl: './marks-dialog.component.html',
  styleUrls: ['./marks-dialog.component.css']
})
export class MarksDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: MarksLayer;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.ca = data.ca;
    this.layer = data.layer;
  }

  ngOnInit() {
  }

}
