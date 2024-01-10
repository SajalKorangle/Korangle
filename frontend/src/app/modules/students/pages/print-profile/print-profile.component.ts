import { Component, OnInit } from '@angular/core';
import { PrintProfileServiceAdapter } from './print-profile.service.adapter';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { DataStorage } from '../../../../classes/data-storage';
import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_PROFILE } from '../../../../print/print-routes.constants';
import { GenericService } from '@services/generic/generic-service';

declare const $: any;

@Component({
    selector: 'app-print-profile',
    templateUrl: './print-profile.component.html',
    styleUrls: ['./print-profile.component.css'],
    providers: [
        SchoolService,
        GenericService,
    ],
})
export class PrintProfileComponent implements OnInit {
    sessionList = [];

    user;

    // From Service Adapter
    selectedStudent: any;
    selectedStudentSection: any;
    classList: any;
    sectionList: any;
    studentList: any;
    classSubjectList = [];
    boardList: any;
    busStopList: any;

    serviceAdapter: PrintProfileServiceAdapter;

    isLoading = false;
    isStudentListLoading = false;

    constructor(
        public schoolService: SchoolService,
        public genericService: GenericService,
        public printService: PrintService,
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new PrintProfileServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    getClassName(parentClass: number): any {
        return this.classList.find((classs) => {
            return parentClass == classs.id;
        }).name;
    }

    getSectionName(parentSection): any {
        if (parentSection != null) {
            return this.sectionList.find((section) => {
                return parentSection == section.id;
            }).name;
        }
    }

    getCurrentBusStop(currentBusStop: number) {
        if (currentBusStop != null) {
            return this.busStopList.find((busStop) => {
                return busStop.id == currentBusStop;
            }).stopName;
        }
    }

    handleDetailsFromParentStudentFilter(value): void {
        this.classList = value['classList'];
        this.sectionList = value['sectionList'];
    }

    handleStudentListSelection(value): void {
        console.log(value);
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.serviceAdapter.getStudentProfile(this.selectedStudent.id);
    }

    printProfile() {
        const value = {
            studentProfile: this.selectedStudent,
            studentSection: this.selectedStudentSection,
            sessionList: this.sessionList,
            classList: this.classList,
            sectionList: this.sectionList,
            boardList: this.boardList,
            busStopList: this.busStopList,
        };
        this.printService.navigateToPrintRoute(PRINT_STUDENT_PROFILE, { user: this.user, value });
    }
}
