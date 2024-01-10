import { Component, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';

import { TransferCertificate } from '../../classes/transfer-certificate';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_TC } from '../../../../print/print-routes.constants';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';


@Component({
    selector: 'generate-tc',
    templateUrl: './generate-tc.component.html',
    styleUrls: ['./generate-tc.component.css'],
    providers: [
        StudentOldService,
        GenericService,
        SchoolService
    ],
})
export class GenerateTcComponent implements OnInit {
    user;

    selectedStudent: Student;
    studentFromFilter: any;

    selectedTransferCertificate: TransferCertificate = new TransferCertificate();

    currentTransferCertificate: TransferCertificate = new TransferCertificate();

    showDetails: boolean = false;

    isLoading = false;
    // isStudentListLoading = false;

    twoCopies = false;

    selectedSession: any;
    sessionList: any;

    boardList: any;

    isStudentListLoading = false;

    // Boolean variable to check if all the required fields are coming from student profile
    fatherNameIsComing = false;
    motherNameIsComing = false;
    scholarNumberIsComing = false;
    addressIsComing = false;
    dateOfBirthIsComing = false;
    aadharNumberIsComing = false;
    sssmidIsComing = false;
    genderIsComing = false;
    casteIsComing = false;
    categoryIsComing = false;

    // flag to show the error message or not
    flag = false;
    count = 0;

    constructor(
        private studentService: StudentOldService,
        private schoolService: SchoolService,
        private genericService: GenericService,
        private printService: PrintService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        Promise.all([this.schoolService.getObjectList(this.schoolService.board, {})]).then(
            (value) => {
                this.boardList = value[0];
            },
            (error) => {}
        );

        this.getSessionList();
    }

    handleStudentListSelection(studentList: any): void {
        this.selectedStudent = studentList[0][0];
        this.selectedStudent.dbId = studentList[0][0].id;
        this.studentFromFilter = studentList[0][0];
        if (this.selectedStudent == null) {
            this.showDetails = false;
        } else {
            this.getStudentProfile();
        }
    }

    getSessionList(): void {
        this.genericService.getObjectList({school_app: 'Session'}, {}).then((sessionList) => {
            this.sessionList = sessionList;
            this.sessionList.every((session) => {
                if (session.id === this.user.activeSchool.currentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const student_data = {
            studentDbId: this.selectedStudent.dbId,
            sessionDbId: this.selectedSession.id,
        };
        if (this.selectedStudent.parentTransferCertificate) {
            const transfer_certificate_data = {
                id: this.selectedStudent.parentTransferCertificate,
            };
            Promise.all([
                this.studentService.getStudentProfile(student_data, this.user.jwt),
                this.studentService.getTransferCertificate(transfer_certificate_data, this.user.jwt),
            ]).then(
                (value) => {
                    this.isLoading = false;
                    if (this.selectedStudent.dbId === value[0].dbId) {
                        this.selectedStudent = new Student();
                        this.selectedStudent.copy(value[0]);
                    }
                    if (this.selectedStudent.parentTransferCertificate === value[1].id) {
                        this.selectedTransferCertificate.copy(value[1]);
                        this.currentTransferCertificate.copy(value[1]);
                    }
                    this.showDetails = true;
                    this.checkAllRequiredDetailsAreComing(this.selectedStudent);
                },
                (error) => {
                    this.isLoading = false;
                }
            );
        } else {
            this.studentService.getStudentProfile(student_data, this.user.jwt).then(
                (student) => {
                    this.isLoading = false;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent = new Student();
                        this.selectedStudent.copy(student);
                        this.selectedTransferCertificate.clean();
                        this.currentTransferCertificate.clean();
                    }
                    this.showDetails = true;
                    this.checkAllRequiredDetailsAreComing(this.selectedStudent);
                },
                (error) => {
                    this.isLoading = false;
                }
            );
        }
    }

    isValidCertificate(): boolean {
        if (this.currentTransferCertificate.certificateNumber == null) {
            alert('Certificate Number field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.issueDate == null) {
            alert('Issue Date field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingDate == null) {
            alert('Leaving Date field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingReason == null) {
            alert('Leaving Reason field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.lastClassPassed == null) {
            alert('Last Class passed field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingMidSession == null) {
            alert('Leaving Mid Session field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.admissionClass == null) {
            alert('Admission Class should be filled');
            return false;
        }
        return true;
    }

    generateTC(): void {
        if (!this.isValidCertificate()) {
            return;
        }
        this.isLoading = true;
        let selectedStudentId = this.selectedStudent.dbId;
        this.studentService.createTransferCertificate(this.currentTransferCertificate, this.user.jwt).then(
            (response) => {
                // alert(response.message);
                if (response.id !== 0) {
                    const data = {
                        id: selectedStudentId,
                        parentTransferCertificate: response.id,
                    };
                    this.studentService.partiallyUpdateStudentFullProfile(data, this.user.jwt).then((response) => {
                        this.isLoading = false;
                        if (response.status === 'success') {
                            alert('Transfer Certificate generated successfully');

                            this.currentTransferCertificate.id = data.parentTransferCertificate;
                            this.selectedTransferCertificate.copy(this.currentTransferCertificate);
                            this.printTCSecondFormat();
                        } else {
                            alert('Failed to link generated transfer certificate to student, Contact Admin');
                        }
                    });
                    this.selectedStudent.parentTransferCertificate = response.id;
                    this.studentFromFilter.parentTransferCertificate = response.id;
                } else {
                    this.isLoading = false;
                    alert('Failed to generate Transfer Certificate');
                }
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    updateTC(): void {
        if (!this.isValidCertificate()) {
            return;
        }
        this.isLoading = true;
        this.studentService.updateTransferCertificate(this.currentTransferCertificate, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert(response.message);

                this.selectedTransferCertificate.copy(this.currentTransferCertificate);
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    printTCSecondFormat(): void {
        const value = {
            studentProfile: this.selectedStudent,
            transferCertificate: this.selectedTransferCertificate,
            boardList: this.boardList,
            twoCopies: this.twoCopies,
        };
        this.printService.navigateToPrintRoute(PRINT_TC, { user: this.user, value });
    }

    cancelTc(): void {
        if (!confirm('Are you sure, you want to cancel TC')) {
            return;
        }
        this.isLoading = true;
        this.studentService.deleteTransferCertificate(this.selectedStudent.parentTransferCertificate, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert('TC has been cancelled successfully');

                this.selectedTransferCertificate.id = 0;
                this.selectedStudent.parentTransferCertificate = null;
                this.studentFromFilter.parentTransferCertificate = null;
            },
            (error) => {
                this.isLoading = false;
            }
        );
        this.selectedTransferCertificate.clean();
    }

    intializeVariables() {
        // Boolean variable to check if all the required fields are coming from student profile
        this.fatherNameIsComing = false;
        this.motherNameIsComing = false;
        this.scholarNumberIsComing = false;
        this.addressIsComing = false;
        this.dateOfBirthIsComing = false;
        this.aadharNumberIsComing = false;
        this.sssmidIsComing = false;
        this.genderIsComing = false;
        this.casteIsComing = false;
        this.categoryIsComing = false;

        // flag to show the error message or not
        this.flag = false;
        this.count = 0;
    }
    checkAllRequiredDetailsAreComing(selectedStudent) {
        this.intializeVariables();
        if (selectedStudent.fathersName) {
            this.fatherNameIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.motherName) {
            this.motherNameIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.scholarNumber) {
            this.scholarNumberIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.address) {
            this.addressIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.dateOfBirth) {
            this.dateOfBirthIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.aadharNum) {
            this.aadharNumberIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.childSSMID) {
            this.sssmidIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.gender) {
            this.genderIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.caste) {
            this.casteIsComing = true;
        } else {
            this.count++;
        }
        if (selectedStudent.category) {
            this.categoryIsComing = true;
        } else {
            this.count++;
        }
    }
}
