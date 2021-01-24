import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DesignReportCardComponent } from './../../pages/design-report-card/design-report-card.component';


@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.css']
})
export class InventoryDialogComponent implements OnInit {

  vm: DesignReportCardComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
  }

  ngOnInit() {
  }

}
