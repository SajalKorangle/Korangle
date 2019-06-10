import { Component, Input, OnInit } from '@angular/core';

import {ExaminationOldService} from '../../../../services/examination-old.service';
import {StudentOldService} from '../../../students/student-old.service';
import {SubjectOldService} from '../../../../services/subject-old.service';
import {ClassService} from '../../../../services/class.service';

import { GenerateHallTicketServiceAdapter } from './generate-hall-ticket.service.adapter';
import {EmitterService} from '../../../../services/emitter.service';

@Component({
    selector: 'generate-hall-ticket',
    templateUrl: './generate-hall-ticket.component.html',
    styleUrls: ['./generate-hall-ticket.component.css'],
    providers: [ ExaminationOldService, SubjectOldService, StudentOldService, ClassService ],
})

export class GenerateHallTicketComponent implements OnInit {

    @Input() user;

    selectedExamination: any;

    examinationList: any;

    serviceAdapter: GenerateHallTicketServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationOldService,
                public studentService: StudentOldService,
                public subjectService: SubjectOldService,
                public classService: ClassService) {}

    ngOnInit(): void {
        this.serviceAdapter = new GenerateHallTicketServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    printHallTicket(): void {
        let data = {
            'studentList': this.selectedExamination.selectedClass.selectedSection.studentList,
            'examination': this.selectedExamination,
        };
        EmitterService.get('print-hall-ticket').emit(data);
        alert('This may take a while');
    }

}
