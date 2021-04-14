import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DesignTCComponent } from '../../../pages/design-tc/design-tc.component';


@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.css']
})
export class InventoryDialogComponent implements OnInit {

  vm: DesignTCComponent;

  selectedLayout: { type: string, index: number } = { type: null, index: null };  // type = page

  constructor(public dialogRef: MatDialogRef<InventoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.vm = data.vm;
    this.selectedLayout = data.selectedLayout;
  }

  ngOnInit() { }
  
  resetSelection(): void{
    this.selectedLayout = { type: null, index: null };
  }

  apply():void {
    this.dialogRef.close({ ...this.selectedLayout });
  }

}
