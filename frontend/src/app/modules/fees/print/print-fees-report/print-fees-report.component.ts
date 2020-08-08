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
  template : any;
  viewChecked = true;

  constructor(private cdRef: ChangeDetectorRef,
              private printService : PrintService,) { }
  
  ngOnInit():void{
    const value = this.printService.getData();
    this.user = value['user'];
    this.template = value['template'];
    this.viewChecked = false;    
    // window.print();
  }

  ngAfterViewChecked(): void {
    if (this.viewChecked === false) {
      this.viewChecked = true;
      this.printService.print();
      this.template = null;
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.template = null;
  }

}
