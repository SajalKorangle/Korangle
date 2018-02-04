import { Component, OnInit, OnDestroy } from '@angular/core';


import { EmitterService } from '../../services/emitter.service';

@Component({
    selector: 'app-print-student-list',
    templateUrl: './print-student-list.component.html',
    styleUrls: ['./print-student-list.component.css'],
})
export class PrintStudentListComponent implements OnInit, OnDestroy {

    studentList: any;
    columnFilter: any;

    printStudentListComponentSubscription: any;

    ngOnInit(): void {
        this.printStudentListComponentSubscription = EmitterService.get('print-student-list-component').subscribe( value => {
            this.studentList = value['studentList'];
            this.columnFilter = value['columnFilter'];
            setTimeout(() => {
                window.print();
            });
        });
    }

    ngOnDestroy(): void {
        this.printStudentListComponentSubscription.unsubscribe();
    }

}
