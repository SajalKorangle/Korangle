import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Class, Section, Session, ClassSectionSession, StudentAndStudentSectionJoined, Student } from '../backtrack-student.models';
import { ClassSectionModalDynamicValues } from './class-section-modal.dynamic.values';
import { ClassSectionModalHtmlAdapter } from './class-section-modal.html.adapter';


@Component({
  selector: 'app-class-section-modal',
  templateUrl: './class-section-modal.component.html',
  styleUrls: ['./class-section-modal.component.css']
})
export class ClassSectionModalComponent implements OnInit {

    user;

    student: Student;
    classList: Class[] = [];
    sectionList: Section[] = [];
    sessionList: Session[] = [];

    dynamicValues: ClassSectionModalDynamicValues;
    htmlAdapter: ClassSectionModalHtmlAdapter;

    constructor(
        public dialogRef: MatDialogRef<ClassSectionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.user = data.user;
        this.student = data.student;
        this.classList = data.classList;
        this.sectionList = data.sectionList;
        this.sessionList = data.sessionList;
    }

    ngOnInit() {

        this.dynamicValues = new ClassSectionModalDynamicValues();
        this.dynamicValues.initialize(this);

        this.htmlAdapter = new ClassSectionModalHtmlAdapter();
        this.htmlAdapter.initialize(this);

    }

}