import { Component, Input, OnInit } from '@angular/core';

import { Session } from '../../classes/session';
import { Classs } from '../../classes/classs';

// import { SessionClassListService } from '../../services/session-class-list.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-promote-student',
  templateUrl: './promote-student.component.html',
  styleUrls: ['./promote-student.component.css'],
    providers: [ StudentService ],
})
export class PromoteStudentComponent implements OnInit {

    @Input() user;

    fromSession: any;
    fromClass: any;

    toSession: any;
    toClass: any;

    sessionList: Session[] = [];

    isLoading = false;
    isListLoading = false;

    constructor (public studentService: StudentService) { }

    onChangeFromSession(selectedSession): void {
        this.fromSession = selectedSession;
        this.populateFromClass();
    }

    populateFromClass(): void {
        if (this.fromSession.classList.length !== 0) {
            this.fromClass = this.fromSession.classList[0];
            // this.getStudentData();
        } else {
            this.fromClass = null;
        }
    }

    onChangeToSession(promotedSession): void {
        this.toSession = promotedSession;
        this.populateToClass();
    }

    populateToClass(): void {
        if (this.toSession.classList.length !== 0) {
            this.toClass = this.toSession.classList[0];
        } else {
            this.toClass = null;
        }
    }

    selectAllStudents(classs: any): void {
        if (classs && classs.studentList.length > 0) {
            classs.studentList.forEach( student => {
                student.checked = true;
            });
        }
    }

    unselectAllStudents(classs: any): void {
        if (classs && classs.studentList.length > 0) {
            classs.studentList.forEach( student => {
                student.checked = false;
            });
        }
    }

    ngOnInit(): void {
        /*this.isListLoading = true;
        this.sessionClassListService.getSessionClassList(this.user.jwt).then(
            sessionClassList => {
                this.isListLoading = false;
                this.sessionList = [];
                console.log(sessionClassList);
                sessionClassList.forEach( session => {
                    const tempSession = new Session();
                    tempSession.name = session.name;
                    tempSession.dbId = session.dbId;
                    session.classList.forEach( classs => {
                        const tempClass = new Classs();
                        tempClass.name = classs.name;
                        tempClass.dbId = classs.dbId;
                        tempSession.classList.push(tempClass);
                    });
                    this.sessionList.push(tempSession);
                });

                this.fromSession = this.sessionList[0];
                this.populateFromClass();

                this.toSession = this.sessionList[1];
                this.populateToClass();
            }, error => {
                this.isListLoading = false;
            }
        );*/
    }

    getStudentList(session: any, classs: any): void {
        /*this.isLoading = true;
        this.studentService.getStudentListSessionClassWise(session.dbId, classs.dbId, this.user.jwt).then(
            data => {
                // console.log(data);
                this.isLoading = false;
                this.sessionList.forEach( session => {
                    session.classList.forEach( classs => {
                        if (session.dbId === data.sessionDbId && classs.dbId === data.classDbId) {
                            data.studentList.forEach( student => {
                                student.checked = true;
                            });
                            classs.studentList = data.studentList;
                        }
                    });
                });
            }, error => {
                this.isLoading = false;
            }
        );*/
    }
/*
    promoteStudentList(): void {
        if (this.fromSession.dbId > this.toSession.dbId) {
            alert('Can not promote student to a previous session');
            return;
        }
        if (this.fromClass.studentList.length === 0) {
            alert('No student in this class to promote');
            return;
        }
        if (this.fromSession.dbId === this.toSession.dbId) {
            if (!confirm('Are you sure want to change class of selected student in same session')) {
                return;
            }
        }
        const studentListForPromotion = [];
        this.fromClass.studentList.forEach(
            student => {
                if (student.checked) {
                    studentListForPromotion.push(student.dbId);
                }
            }
        );
        this.isLoading = true;
        this.studentService.promoteStudentList(studentListForPromotion,
            this.fromSession.dbId, this.fromClass.dbId,
            this.toSession.dbId, this.toClass.dbId, this.user.jwt).then(
            data => {
                this.isLoading = false;
                if (data.result === 'success') {
                    alert('Student Promoted Successfully');
                    this.sessionList.forEach( session => {
                        session.classList.forEach( classs => {
                            if (session.dbId === data.fromList.sessionDbId && classs.dbId === data.fromList.classDbId) {
                                data.fromList.studentList.forEach( student => {
                                    student.checked = false;
                                });
                                classs.studentList = data.fromList.studentList;
                            }
                            if (session.dbId === data.toList.sessionDbId && classs.dbId === data.toList.classDbId) {
                                data.toList.studentList.forEach( student => {
                                    student.checked = false;
                                });
                                classs.studentList = data.toList.studentList;
                            }
                        });
                    });
                } else {
                    alert('Student Promotion failed');
                }
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }
*/
    removeStudentList(): void {
        alert('Functionality is yet to be implemented');
    }

}
