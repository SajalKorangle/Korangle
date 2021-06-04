import { Component, OnInit, Inject } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MessageService } from '@services/message-service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import { NotificationService } from '../../../../services/modules/notification/notification.service';
import { SmsService } from '../../../../services/modules/sms/sms.service';
import { SmsOldService } from '../../../../services/modules/sms/sms-old.service';
import { IssueHomeworkServiceAdapter } from './issue-homework.service.adapter';
import { UserService } from '../../../../services/modules/user/user.service';
import { isMobile } from '../../../../classes/common.js';

import { Homework } from '../../../../services/modules/homework/models/homework';
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';
import { EditHomeworkDialogComponent } from './edit-homework/edit-homework.component';

export interface EditHomeworkDialogData {
    id: any;
    homeworkName: any;
    parentClassSubject: any;
    startDate: any;
    startTime: any;
    endDate: any;
    endTime: any;
    homeworkText: any;
    homeworkImages: any;
    editRequired: any;
}

export interface ImagePreviewDialogData {
    homeworkImages: any;
    index: any;
    editable: any;
    isMobile: any;
}

@Component({
    selector: 'issue-homework',
    templateUrl: './issue-homework.component.html',
    styleUrls: ['./issue-homework.component.css'],
    providers: [SubjectService, HomeworkService, ClassService, StudentService, NotificationService, UserService, SmsService, SmsOldService],
})
export class IssueHomeworkComponent implements OnInit {
    // @Input() user;
    user: any;

    STUDENT_LIMITER = 200;
    notif_usernames = [];

    classSectionSubjectList: any;
    selectedClassSection: any;
    selectedSubject: any;

    homeworkList: any;
    homeworkImagesList: any;
    currentHomework: Homework;
    homeworkDisplayList: any;

    currentHomeworkImages: any;
    isInitialLoading: any;
    isLoading: any;
    showContent: any;
    editableHomework: any;

    noPermission: any;
    smsBalance: any;

    dataForMapping =  {} as any;

    // studentList: any;
    serviceAdapter: IssueHomeworkServiceAdapter;

    messageService: any;

    constructor(
        public subjectService: SubjectService,
        public homeworkService: HomeworkService,
        public classService: ClassService,
        public studentService: StudentService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
        public dialog: MatDialog
    ) {}

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.isInitialLoading = true;
        this.isLoading = false;
        this.showContent = false;
        this.noPermission = false;
        this.currentHomework = new Homework();
        this.currentHomeworkImages = [];

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.serviceAdapter = new IssueHomeworkServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    changeClassSection(): any {
        this.selectedSubject = this.selectedClassSection.subjectList[0];
    }

    readURL(event): void {
        if (event.target.files && event.target.files[0]) {
            let image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert('File type should be either jpg, jpeg, or png');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                let tempImageData = {
                    orderNumber: null,
                    parentHomeworkQuestion: null,
                    questionImage: reader.result,
                };
                this.currentHomeworkImages.push(tempImageData);
            };
            reader.readAsDataURL(image);
        }
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

    removeImage(index: any): any {
        this.currentHomeworkImages.splice(index, 1);
    }

    editHomework(homeworkId: any): any {
        let tempHomework = this.homeworkList.find((homework) => homework.id == homeworkId);
        this.editableHomework = JSON.parse(JSON.stringify(tempHomework));
        this.editableHomework.editRequired = true;
    }

    openEditHomeworkDialog(): void {
        const dialogRef = this.dialog.open(EditHomeworkDialogComponent, {
            width: '1000px',
            data: this.editableHomework,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (this.editableHomework.editRequired) {
                this.isLoading = true;
                this.serviceAdapter.updateHomework(this.editableHomework);
            }
        });
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable: any): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { homeworkImages: homeworkImages, index: index, editable: editable, isMobile: this.isMobile() },
        });

        dialogRef.afterClosed();
    }

    isMobile(): boolean {
        return isMobile();
    }

    isCreateButtonDisabled(str: string): boolean {
        if (str == null) {
            return true;
        }
        if (str.trim().length == 0) {
            return true;
        }
        return false;
    }
}
