import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DesignReportCardComponent } from '../../../pages/design-report-card/design-report-card.component';


@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.css']
})
export class InventoryDialogComponent implements OnInit {

  vm: DesignReportCardComponent;

  selectedLayout: any;  // type = page

  constructor(public dialogRef: MatDialogRef<InventoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
    this.selectedLayout = data.selectedLayout;
  }

  ngOnInit() {}

  resetSelection(): void{
    this.selectedLayout = null;
  }

  isMyLayout():boolean {
    return this.vm.reportCardLayoutList.find(layout => layout == this.selectedLayout) != undefined;
  }

  apply(): void {
    if (this.isMyLayout() || this.selectedLayout == this.vm.ADD_LAYOUT_STRING) {
      this.dialogRef.close({ layout: this.selectedLayout, copy: false });
    }
    else {
      this.copyAndApply();
    }
  }

  copyAndApply(): void{
    this.dialogRef.close({ layout: this.selectedLayout, copy: true });
  }

}
