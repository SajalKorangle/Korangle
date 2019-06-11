import {Component, OnInit, OnDestroy, AfterViewChecked, Input, ChangeDetectorRef} from '@angular/core';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
    selector: 'app-print-employee-exp-certi',
    templateUrl: './print-employee-exp-certi.component.html',
    styleUrls: ['./print-employee-exp-certi.component.css'],
})
export class PrintEmployeeExpCertiComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() user;

    printExpCertiComponentSubscription: any;

    viewChecked =  true;

    employeeProfile: any;

    employee: any;

    constructor(private cdRef: ChangeDetectorRef) { }


    ngOnInit(): void {
        this.printExpCertiComponentSubscription = EmitterService.get('print-employee-exp-certi-component').subscribe( value => {
            this.employeeProfile = value;
            this.employee = this.employeeProfile.employeeFullProfile;
            this.viewChecked = false;
        });
    }


    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
            this.employeeProfile = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.printExpCertiComponentSubscription.unsubscribe();
        this.employeeProfile = null;
    }

}
