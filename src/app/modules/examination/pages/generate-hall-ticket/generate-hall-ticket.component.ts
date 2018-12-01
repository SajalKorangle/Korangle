import { Component, Input, OnInit } from '@angular/core';

import {ExaminationService} from '../../../../services/examination.service';
import {StudentService} from '../../../students/student.service';
import {SubjectService} from '../../../../services/subject.service';
import {ClassService} from '../../../../services/class.service';

import { GenerateHallTicketServiceAdapter } from './generate-hall-ticket.service.adapter';
import {EmitterService} from '../../../../services/emitter.service';

@Component({
    selector: 'generate-hall-ticket',
    templateUrl: './generate-hall-ticket.component.html',
    styleUrls: ['./generate-hall-ticket.component.css'],
    providers: [ ExaminationService, SubjectService, StudentService, ClassService ],
})

export class GenerateHallTicketComponent implements OnInit {

    @Input() user;

    selectedExamination: any;

    examinationList: any;

    serviceAdapter: GenerateHallTicketServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public studentService: StudentService,
                public subjectService: SubjectService,
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
