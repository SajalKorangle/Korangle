import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DesignTCCanvasAdapter } from 'app/modules/tc/pages/design-tc/design-tc.canvas.adapter';

@Component({
  selector: 'app-tc-default-parameters-dialog',
  templateUrl: './tc-default-parameters-dialog.component.html',
  styleUrls: ['./tc-default-parameters-dialog.component.css']
})
export class TCDefaultParametersDialogComponent implements OnInit {

  ca: DesignTCCanvasAdapter;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.ca = data.ca;
  }

  ngOnInit() {
  }

}
