import { Component, OnInit, OnChanges, HostListener } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';
import { ViewHomeworkServiceAdapter } from './view-homework.service.adapter';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';

import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { isMobile } from '../../../../classes/common.js';

import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';

import { CdkDragDrop, moveItemInArray, CdkDragEnter } from '@angular/cdk/drag-drop';

@Component({
    selector: 'view-homework',
    templateUrl: './view-homework.component.html',
    styleUrls: ['./view-homework.component.css'],
    providers: [HomeworkService, SubjectService, StudentService],
})
export class ViewHomeworkComponent implements OnInit, OnChanges {
    user;

    isLoadingHomeworks: false;
    loadMoreHomework = true;

    selectedStudent: any;

    isLoading = false;
    isSessionLoading = false;
    showContent = false;

    serviceAdapter: any;

    subjectList: any;

    isSubmitting: any;

    selectedSubject: any;
    studentClassData: any;
    currentHomework: any;

    pendingHomeworkList: any;
    completedHomeworkList: any;
    homeworkOpen: any;

    isHomeworkLoading: any;
    currentHomeworkImages: any;
    currentHomeworkAnswerImages: any;
    toSubmitHomework: any;

    constructor(
        public homeworkService: HomeworkService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public dialog: MatDialog
    ) {}

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.isSubmitting = false;
        this.showContent = false;
        this.loadMoreHomework = true;
        this.serviceAdapter = new ViewHomeworkServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
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
        str = tempStr + str;
        str = str + ' ; ';
        for (let i = 0; i < 5; i++) {
            str = str + time[i];
        }

        return str;
    }

    getClass() {
        let classs = '';
        if (this.isSubmitting == true) {
            classs += 'col-md-6';
        } else {
            classs += 'col-md-12';
        }
        return classs;
    }

    onNoClick(): any {
        this.isSubmitting = false;
        this.toSubmitHomework = {};
    }

    readURL(event): void {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png' && image.type !== 'application/pdf') {
                alert('File type should be either pdf, jpg, jpeg, or png');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                let tempImageData = {
                    orderNumber: null,
                    parentHomeworkQuestion: this.toSubmitHomework.dbId,
                    parentStudent: this.selectedStudent,
                    answerImage: reader.result,
                };
                this.toSubmitHomework.answerImages.push(tempImageData);
                // this.updatePDF();
            };
            reader.readAsDataURL(image);
        }
    }

    removeImage(index: any) {
        this.toSubmitHomework.answerImages.splice(index, 1);
    }

    submitHomework(homework: any) {
        this.toSubmitHomework = JSON.parse(JSON.stringify(homework));
        this.toSubmitHomework.questionImages = [];
        this.toSubmitHomework.answerImages = [];
        this.toSubmitHomework.previousAnswerImages = [];

        this.currentHomeworkImages.forEach((element) => {
            this.toSubmitHomework.questionImages.push(element);
        });
        this.currentHomeworkAnswerImages.forEach((element) => {
            this.toSubmitHomework.answerImages.push(element);
            this.toSubmitHomework.previousAnswerImages.push(element);
        });
        this.isSubmitting = true;
    }

    getFilteredHomeworkList(): any {
        return this.pendingHomeworkList.filter((homeworks) => {
            if (this.selectedSubject.id == -1) return true;
            if (homeworks.subjectDbId == this.selectedSubject.id) return true;
            return false;
        });
    }

    getFilteredCompletedHomeworkList(): any {
        return this.completedHomeworkList.filter((homeworks) => {
            if (this.selectedSubject.id == -1) return true;
            if (homeworks.subjectDbId == this.selectedSubject.id) return true;
            return false;
        });
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event) {
        if (
            document.documentElement.clientHeight + document.documentElement.scrollTop > 0.7 * document.documentElement.scrollHeight &&
            this.loadMoreHomework == true
        ) {
            this.serviceAdapter.loadMoreHomeworks();
        }
    }

    isMobile(): boolean {
        return isMobile();
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { homeworkImages: homeworkImages, index: index, editable: editable, isMobile: this.isMobile() },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }
}
