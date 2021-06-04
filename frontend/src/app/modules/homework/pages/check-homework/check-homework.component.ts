import { Component, Input, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';

import { UpdateService } from '../../../../update/update-service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import { CheckHomeworkServiceAdapter } from './check-homework.service.adapter';
import { NotificationService } from '../../../../services/modules/notification/notification.service';
import { SmsService } from '../../../../services/modules/sms/sms.service';
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { UserService } from '../../../../services/modules/user/user.service';
import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';
import { isMobile } from '../../../../classes/common.js';

@Component({
    selector: 'check-homework',
    templateUrl: './check-homework.component.html',
    styleUrls: ['./check-homework.component.css'],
    providers: [SubjectService, StudentService, ClassService, HomeworkService, NotificationService, UserService, SmsService, SmsOldService],
})
export class CheckHomeworkComponent implements OnInit {
    // @Input() user;
    user: any;

    serviceAdapter: CheckHomeworkServiceAdapter;
    isInitialLoading: any;
    isLoading: any;
    isChecking: any;

    STUDENT_LIMITER = 200;
    notif_usernames = [];
    smsBalance = 0;

    dataForMapping =  {} as any;

    classSectionHomeworkList: any;
    selectedClassSection: any;
    selectedSubject: any;
    selectedHomework: any;
    currentHomework: any;
    studentList: any;


    studentHomeworkList: any;

    homeworkReport: any;

    HOMEWORK_STATUS = ['GIVEN', 'SUBMITTED', 'CHECKED', 'ASKED FOR RESUBMISSION'];

    updateService: any;

    constructor(
        public classService: ClassService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public homeworkService: HomeworkService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
        public dialog: MatDialog
    ) {}
    // Server Handling - Initial
    ngOnInit(): void {
        this.currentHomework = null;
        this.isLoading = false;
        this.isChecking = false;
        this.classSectionHomeworkList = [];
        this.user = DataStorage.getInstance().getUser();

        this.updateService = new UpdateService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new CheckHomeworkServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    changeClassSection(): any {
        this.selectedSubject = this.selectedClassSection.subjectList[0];
    }

    displayDateTime(date: any, time: any): any {
        let str = '';
        let tempStr = '';

        if (date == null) {
            str = 'No deadline';
            return str;
        }
        for (let i = 0; i < date.length; i++) {
            if (date[i] == '-') {
                str = '-' + tempStr + str;
                tempStr = '';
            } else {
                tempStr += date[i];
            }
        }
        str = tempStr + str + ' ; ';
        for (let i = 0; i < 5; i++) {
            str = str + time[i];
        }

        return str;
    }

    getButtonClass(status: any): any {
        let classs = 'btn';
        switch (status) {
            case this.HOMEWORK_STATUS[3]:
                classs += ' btn-danger';
                break;
            case this.HOMEWORK_STATUS[2]:
                classs += ' btn-success';
                break;
            case this.HOMEWORK_STATUS[1]:
                classs += ' btn-warning';
                break;
            case this.HOMEWORK_STATUS[0]:
                classs += ' btn-secondary';
                break;
        }
        return classs;
    }

    getLoaderClass(studentHomework: any): any {
        let classs = '';
        switch (studentHomework.isStatusLoading) {
            case true:
                classs += 'loader-custom';
                break;
            case false:
                classs += 'loader-hide';
                break;
        }
        return classs;
    }

    changeStudentHomeworkStatus(temp: any): void {
        if (!temp.status) {
            temp.status = this.HOMEWORK_STATUS[0];
            return;
        }
        let counter = 0;
        for (let i = 0; i < 4; ++i) {
            if (this.HOMEWORK_STATUS[i] === temp.status) {
                counter = i;
                break;
            }
        }
        let nextCounter = (counter + 1) % this.HOMEWORK_STATUS.length;
        if (counter == 3) {
            nextCounter = (counter + 3) % this.HOMEWORK_STATUS.length;
        } else if (nextCounter == 3) {
            nextCounter = (counter + 2) % this.HOMEWORK_STATUS.length;
        }
        temp.status = this.HOMEWORK_STATUS[nextCounter];
    }

    askForResubmission(temp: any): void {
        temp.status = this.HOMEWORK_STATUS[3];
    }

    getButtonString(status: any): any {
        let str = '';
        switch (status) {
            case this.HOMEWORK_STATUS[3]:
                str += 'R';
                break;
            case this.HOMEWORK_STATUS[2]:
                str += 'C';
                break;
            case this.HOMEWORK_STATUS[1]:
                str += 'S';
                break;
            case this.HOMEWORK_STATUS[0]:
                str += 'G';
                break;
        }
        return str;
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable: any): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { homeworkImages: homeworkImages, index: index, editable: editable, isMobile: this.isMobile() },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    isMobile(): boolean {
        return isMobile();
    }

    isSubmittedLate(homeworkDate, homeworkTime, studentDate, studentTime): boolean {
        if (homeworkDate == null || studentDate == null) {
            return false;
        } else if (studentDate > homeworkDate) {
            return true;
        } else if (studentDate < homeworkDate) {
            return false;
        } else {
            if (studentTime > homeworkTime) {
                return true;
            }
        }
        return false;
    }
}
