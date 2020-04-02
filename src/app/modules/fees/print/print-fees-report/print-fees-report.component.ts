import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
  selector: 'app-print-fees-report',
  templateUrl: './print-fees-report.component.html',
  styleUrls: ['./print-fees-report.component.css']
})
export class PrintFeesReportComponent implements  OnInit, AfterViewChecked {

  user : any;
  viewChecked = true;

  constructor(private cdRef: ChangeDetectorRef,
              private printService : PrintService,) { }
  
  ngOnInit():void{
    console.log("template data ",this.printService.getData());
    this.printService.print();
    // window.print();
  }

  ngAfterViewChecked(): void {
    if (this.viewChecked === false) {
      this.viewChecked = true;
      this.printService.print();
      this.cdRef.detectChanges();
    }
  }

}
