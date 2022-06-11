import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'app-print-count-all-table-complaints',
    templateUrl: './print-count-all-table-complaints.component.html',
    styleUrls: ['./print-count-all-table-complaints.component.css']
})
export class PrintCountAllTableComplaintsComponent implements OnInit {

    rowData: any = [];
    columnData: any = [];
    tableName: string = "";
    viewChecked: boolean = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { value } = this.printService.getData();
        this.rowData = value['rowData'];
        this.columnData = value['columnData'];
        this.tableName = value['tableName'];
        this.viewChecked = false;
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.rowData = null;
            this.columnData = null;
            this.cdRef.detectChanges();
        }
    }
}
