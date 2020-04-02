import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {INSTALLMENT_LIST} from "../../classes/constants";
import { PrintService } from '../../../../print/print-service';

@Component({
  selector: 'app-print-fees-report',
  templateUrl: './print-fees-report.component.html',
  styleUrls: ['./print-fees-report.component.css']
})
export class PrintFeesReportComponent implements OnInit {
  user : any;
  constructor(private printService : PrintService,) { }
  
  ngOnInit():void{
    console.log("stemp2");    
    console.log("template data ",this.printService.getData());
  }

}
