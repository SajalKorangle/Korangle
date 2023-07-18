import { Component, OnInit } from '@angular/core';
import { DeleteStudentServiceAdapter } from './delete-student.service.adapter';
import { DeleteStudentHtmlRenderer } from './delete-student.html.renderer';
import { DeleteStudentBackendData } from './delete-student.backend.data';
import { DataStorage } from '../../../../classes/data-storage';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

class ColumnFilter {
    showSerialNumber = true;
    showProfileImage = false;
    showName = true;
    showClassName = true;
    showSectionName = true;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = false;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCategory = false;
    showAddress = false;
    showAdmissionSession = false;
    showDateOfAdmission = false;
}
@Component({
    selector: 'app-delete-student',
    templateUrl: './delete-student.component.html',
    styleUrls: ['./delete-student.component.css'],
    providers: [],
})
export class DeleteStudentComponent implements OnInit {
    user;

    bothFilters = false;

    selectedStudent: any;
    studentSectionList = [];
    selectedStudentSectionList = [];
    selectedStudentFeeReceiptList = [];
    selectedStudentDiscountList = [];
    selectedStudentTcList: Array<TransferCertificateNew> = [];

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    isLoading = false;

    isStudentListLoading = false;

    serviceAdapter: DeleteStudentServiceAdapter;
    htmlRenderer: DeleteStudentHtmlRenderer;
    backendData: DeleteStudentBackendData;

    NULL_CONSTANT = null;

    showFilters = false;

    session_list = [];

    columnFilter: ColumnFilter;

    /* Age Check */
    minAge: any;
    maxAge: any;
    asOnDate = new Date();

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;

    /* Admission Session Options */
    newAdmission = true;
    oldAdmission = true;

    /* RTE Options */
    yesRTE = true;
    noRTE = true;
    noneRTE = true;

    /* TC Options */
    noTC = true;
    yesTC = true;

    displayStudentNumber = 0;

    classSectionList = [];

    studentFullProfileList = [];

    busStopList = [];

    studentParameterList: any[] = [];
    studentParameterOtherList: any[] = [];

    studentParameterValueList: any[] = [];

    classStudentSelectList = ['Class', 'Student'];
    currentClassStudentFilter;

    deletablitySelectList = ['All Students', 'Deletable Students', 'Non-Deletable Students'];
    currentDeletablityFilter;

    profileColumns;

    constructor() {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new DeleteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.columnFilter = new ColumnFilter();

        this.backendData = new DeleteStudentBackendData();
        this.backendData.initialize(this);

        this.htmlRenderer = new DeleteStudentHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.currentClassStudentFilter = this.classStudentSelectList[0];
        this.currentDeletablityFilter = this.deletablitySelectList[0];
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
                section.containsStudent = false;
            });
        });
    }

    initializeStudentFullProfileList(studentFullProfileList: any): any {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selectProfile'] = false;
            studentFullProfile['newTransferCertificate'] = this.backendData.tcList.find(tc => tc.parentStudent == studentFullProfile.dbId);
            studentFullProfile['isDeletable'] = false;
            studentFullProfile['nonDeletableMessage'] = '';
        });
        this.serviceAdapter.checkDeletability(this.studentFullProfileList);
        this.handleStudentDisplay();
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
    }

    handleStudentListSelection(value): void {
        this.studentFullProfileList.forEach((student) => {
            if (student.dbId == value[0][0].id) {
                this.selectedStudent = student;
            }
        });
    }

    handleClassStudentFilter(value: any): void {
        this.currentClassStudentFilter = value;
        if (this.currentClassStudentFilter === 'Class') {
            this.selectedStudent = null;
        }
        this.handleStudentDisplay();
    }

    handleDeletablityFilter(value: any): void {
        this.currentDeletablityFilter = value;
        this.handleStudentDisplay();
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
        this.studentParameterList.forEach((item) => {
            item.show = true;
        });
    }

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
        this.studentParameterList.forEach((item) => {
            item.show = false;
        });
    }

    selectAllStudents(): void {
       this.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                student.selectProfile = true;
            }
        });
    }

    unselectAllStudents(): void {
       this.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                student.selectProfile = false;
            }
        });
    }

    getSectionObject(classDbId: any, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every((classs) => {
            classs.sectionList.every((section) => {
                if (sectionDbId === section.id && classDbId === classs.id) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
        return sectionObject;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach((student) => {

            /* Class Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            /* Age Check */
            if (this.asOnDate) {
                let age = student.dateOfBirth
                    ? Math.floor((new Date(this.asOnDate).getTime() - new Date(student.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                    : null;
                if (this.minAge != '' && this.minAge != null && !isNaN(this.minAge)) {
                    if (!age) {
                        student.show = false;
                        return;
                    } else if (age < this.minAge) {
                        student.show = false;
                        return;
                    }
                }
                if (this.maxAge != '' && this.maxAge != null && !isNaN(this.maxAge)) {
                    if (!age) {
                        student.show = false;
                        return;
                    } else if (age > this.maxAge) {
                        student.show = false;
                        return;
                    }
                }
            }

            /* Category Check */
            if (
                !(this.scSelected && this.stSelected && this.obcSelected && this.generalSelected) &&
                !(!this.scSelected && !this.stSelected && !this.obcSelected && !this.generalSelected)
            ) {
                if (student.category === null || student.category === '') {
                    student.show = false;
                    return;
                }
                switch (student.category) {
                    case 'SC':
                        if (!this.scSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'ST':
                        if (!this.stSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'OBC':
                        if (!this.obcSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Gen.':
                        if (!this.generalSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Gender Check */
            if (
                !(this.maleSelected && this.femaleSelected && this.otherGenderSelected) &&
                !(!this.maleSelected && !this.femaleSelected && !this.otherGenderSelected)
            ) {
                if (student.gender === null || student.gender === '') {
                    student.show = false;
                    return;
                }
                switch (student.gender) {
                    case 'Male':
                        if (!this.maleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Female':
                        if (!this.femaleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Other':
                        if (!this.otherGenderSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Admission Filter Check */
            if (!this.newAdmission && student.admissionSessionDbId === this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            } else if (!this.oldAdmission && student.admissionSessionDbId !== this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            }

            /* RTE Filter Check */
            if (
                !(
                    (this.yesRTE && student.rte === 'YES') ||
                    (this.noRTE && student.rte === 'NO') ||
                    (this.noneRTE && student.rte != 'YES' && student.rte != 'NO')
                )
            ) {
                /*
                 First we are checking for which conditions student should be visible then we are applying a 'NOT'
                 to the whole to get student invisible condition
                 */
                student.show = false;
                return;
            }

            // Transfer Certiicate Check
            if (!((this.noTC && !student.parentTransferCertificate && !student.newTransferCertificate)
                || (this.yesTC && (student.parentTransferCertificate || student.newTransferCertificate)))) {
                student.show = false;
                return;
            }

            // Custom filters check
            for (let x of this.htmlRenderer.getFilteredStudentParameterList()) {
                let flag = x.showNone;
                x.filterValues.forEach((filter) => {
                    flag = flag || filter.show;
                });
                if (flag) {
                    let parameterValue = this.htmlRenderer.getParameterValue(student, x);
                    if (parameterValue === this.NULL_CONSTANT && x.showNone) {
                    } else if (
                        !x.filterValues
                            .filter((filter) => filter.show)
                            .map((filter) => filter.name)
                            .includes(parameterValue)
                    ) {
                        student.show = false;
                        return;
                    }
                }
            }

            // Deletability Filter check
            if (this.currentDeletablityFilter == this.deletablitySelectList[1]) {
                if (!student.isDeletable) {
                    student.show = false;
                    return;
                }
            }
            if (this.currentDeletablityFilter == this.deletablitySelectList[2]) {
                if (student.isDeletable) {
                    student.show = false;
                    return;
                }
            }

            ++this.displayStudentNumber;
            student.show = true;
            student.selectProfile = false;
            student.serialNumber = ++serialNumber;
        });
    }

}
