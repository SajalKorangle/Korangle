import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { SubjectOldService } from '../../../../services/modules/subject/subject-old.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { GenericService } from '@services/generic/generic-service';

import { GenerateHallTicketServiceAdapter } from './generate-hall-ticket.service.adapter';
import { PrintService } from '../../../../print/print-service';
import { PRINT_HALL_TICKET } from '../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';

@Component({
    selector: 'generate-hall-ticket',
    templateUrl: './generate-hall-ticket.component.html',
    styleUrls: ['./generate-hall-ticket.component.css'],
    providers: [ExaminationOldService, SubjectOldService, StudentOldService, ClassService, SchoolService, ExaminationService, GenericService],
})
export class GenerateHallTicketComponent implements OnInit {
    user;

    selectedExamination: any;

    examinationList = [];
    showPrincipalSignature = true;

    sessionList: any;

    boardList: any;

    serviceAdapter: GenerateHallTicketServiceAdapter;

    isLoading = false;

    constructor(
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        public studentService: StudentOldService,
        public subjectService: SubjectOldService,
        public schoolService: SchoolService,
        public classService: ClassService,
        public genericService: GenericService,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateHallTicketServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    printHallTicket(): void {
        let data = {
            studentList: this.getSelectedStudentList(),
            examination: this.selectedExamination,
            boardList: this.boardList,
            showPrincipalSignature: this.showPrincipalSignature,
            sessionList: this.sessionList,
        };
        this.printService.navigateToPrintRoute(PRINT_HALL_TICKET, { user: this.user, value: data });
        alert('This may take a while');
    }

    getFilteredStudentSectionList(): any {
        return this.selectedExamination.selectedClass.selectedSection.studentList;
        // this.studentList.forEach(item => item["selected"]= true);
    }

    getSelectedStudentList(): any {
        return this.getFilteredStudentSectionList().filter((studentSection) => {
            return studentSection.selected == true;
        });
    }

    selectAllStudents(): void {
        this.getFilteredStudentSectionList().forEach((student) => {
            student['selected'] = true;
        });
    }

    unselectAllStudents(): void {
        this.getFilteredStudentSectionList().forEach((student) => {
            student['selected'] = false;
        });
    }
}
