import { Component, Input, OnInit } from '@angular/core';

import {ExaminationOldService} from '../../../../services/modules/examination/examination-old.service';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';
import {SubjectOldService} from '../../../../services/modules/subject/subject-old.service';
import {ClassOldService} from '../../../../services/modules/class/class-old.service';

import { GenerateHallTicketServiceAdapter } from './generate-hall-ticket.service.adapter';
import { PrintService } from '../../../../print/print-service';
import { PRINT_HALL_TICKET } from '../../../../print/print-routes.constants';
import {DataStorage} from "../../../../classes/data-storage";
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
    selector: 'generate-hall-ticket',
    templateUrl: './generate-hall-ticket.component.html',
    styleUrls: ['./generate-hall-ticket.component.css'],
    providers: [ ExaminationOldService, SubjectOldService, StudentOldService, ClassOldService, SchoolService ],
})

export class GenerateHallTicketComponent implements OnInit {

     user;

    selectedExamination: any;

    examinationList: any;

    boardList: any;

    serviceAdapter: GenerateHallTicketServiceAdapter;

    isLoading = false;

    constructor(public examinationOldService: ExaminationOldService,
                public studentService: StudentOldService,
                public subjectService: SubjectOldService,
                public schoolService: SchoolService,
                public classService: ClassOldService,
                private printService: PrintService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateHallTicketServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    printHallTicket(): void {
        let data = {
            'studentList': this.selectedExamination.selectedClass.selectedSection.studentList,
            'examination': this.selectedExamination,
            'boardList': this.boardList,
        };
        this.printService.navigateToPrintRoute(PRINT_HALL_TICKET, {user: this.user, value: data});
        alert('This may take a while');
    }

}
