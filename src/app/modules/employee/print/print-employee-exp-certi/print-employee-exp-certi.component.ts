import {Component, OnInit, OnDestroy, AfterViewChecked, Input, ChangeDetectorRef} from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    templateUrl: './print-employee-exp-certi.component.html',
    styleUrls: ['./print-employee-exp-certi.component.css'],
})
export class PrintEmployeeExpCertiComponent implements OnInit, OnDestroy, AfterViewChecked {

    user : any;

    printExpCertiComponentSubscription: any;

    viewChecked =  true;

    employeeProfile: any;

    employee: any;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }


    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.employeeProfile = value;
        this.employee = this.employeeProfile.employeeFullProfile;
        this.viewChecked = false;
    }


    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();
            this.employeeProfile = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.employeeProfile = null;
    }

}
