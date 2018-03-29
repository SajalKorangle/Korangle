import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';


import { EmitterService } from '../../services/emitter.service';
import {viewClassName} from "@angular/compiler";

@Component({
    selector: 'app-print-student-list',
    templateUrl: './print-student-list.component.html',
    styleUrls: ['./print-student-list.component.css'],
})
export class PrintStudentListComponent implements OnInit, OnDestroy, AfterViewChecked {

    // studentList: any;
    classSectionStudentList: any;
    columnFilter: any;

    viewChecked = true;

    printStudentListComponentSubscription: any;

    ngOnInit(): void {
        this.printStudentListComponentSubscription = EmitterService.get('print-student-list-component').subscribe( value => {
            this.classSectionStudentList = value['classSectionStudentList'];
            this.columnFilter = value['columnFilter'];
            this.viewChecked = false;
        });
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            window.print();
        }
    }

    ngOnDestroy(): void {
        this.printStudentListComponentSubscription.unsubscribe();
    }

}
