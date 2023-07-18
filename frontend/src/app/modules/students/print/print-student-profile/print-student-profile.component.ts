import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PrintService } from '../../../../print/print-service';

@Component({
    selector: 'app-print-student-profile',
    templateUrl: './print-student-profile.component.html',
    styleUrls: ['./print-student-profile.component.css'],
})
export class PrintStudentProfileComponent implements OnInit {
    user: any;

    viewChecked = true;

    selectedStudent: any;
    classList: any;
    sessionList: any;
    sectionList: any;
    studentSection: any;
    boardList: any;
    busStopList: any;

    showClass = true;

    constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) {}

    ngOnInit(): void {
        const { user, value } = this.printService.getData();
        this.user = user;
        this.selectedStudent = value.studentProfile;
        this.studentSection = value.studentSection;
        this.classList = value.classList;
        this.sessionList = value.sessionList;
        this.sectionList = value.sectionList;
        this.boardList = value.boardList;
        this.busStopList = value.busStopList;
        this.viewChecked = false;
        console.log(this.printService.getData());
    }

    ngAfterViewChecked(): void {
        if (this.viewChecked === false) {
            this.viewChecked = true;
            this.printService.print();

            this.selectedStudent = null;
            this.studentSection = null;
            this.classList = null;
            this.sessionList = null;
            this.sectionList = null;
            this.boardList = null;
            this.busStopList = null;
            this.cdRef.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.selectedStudent = null;
        this.studentSection = null;
        this.classList = null;
        this.sessionList = null;
        this.sectionList = null;
        this.boardList = null;
        this.busStopList = null;
    }

    getSessionName(parentSession: number) {
        return this.sessionList.find((session) => {
            return session.id == parentSession;
        }).name;
    }

    getClassName(parentClass: number): any {
        return this.classList.find((classs) => {
            return this.studentSection.parentClass == classs.id;
        }).name;
    }

    getSectionName(parentSection): any {
        if (parentSection != null) {
            return this.sectionList.find((section) => {
                return this.studentSection.parentDivision == section.id;
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

}
