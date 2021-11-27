import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { FeeService } from '../../../../services/modules/fees/fee.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { DeleteStudentServiceAdapter } from './delete-student.service.adapter';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';


// VIEW ALL IMPORTS

import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';

import { PrintService } from '../../../../print/print-service';
import { PRINT_STUDENT_LIST } from '../../../../print/print-routes.constants';
import { ExcelService } from '../../../../excel/excel-service';
import { BusStopService } from '@services/modules/school/bus-stop.service';
import { SchoolService } from '@services/modules/school/school.service';

import { MatDialog } from '@angular/material';

import { toInteger, filter } from 'lodash';
import { CommonFunctions } from '@classes/common-functions';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';
import { ComponentsModule } from 'app/components/components.module';
import { DeleteStudentBackendData } from './delete-student.backend.data';

class ColumnFilter {
    showSerialNumber = true;
    showProfileImage = false;
    showName = true;
    showClassName = false;
    showSectionName = false;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = true;
    showSecondMobileNumber = false;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = true;
    showChildSSMID = false;
    showFamilySSMID = false;
    showBankName = false;
    showBankIfscCode = false;
    showBankAccountNum = false;
    showAadharNum = false;
    showBloodGroup = false;
    showFatherAnnualIncome = false;
    showRTE = false;
    showAdmissionSession = false;
    showBusStopName = false;
    showDateOfAdmission = false;
    showRemark = false;
}
@Component({
    selector: 'app-delete-student',
    templateUrl: './delete-student.component.html',
    styleUrls: ['./delete-student.component.css'],
    providers: [FeeService, StudentService, SubjectService, ExaminationService, TCService, StudentOldService, ClassService, ExcelService, BusStopService, SchoolService],
})
export class DeleteStudentComponent implements OnInit {
    user;

    bothFilters = false;

    selectedStudent: any;
    studentList = [];
    selectedStudentSectionList = [];
    selectedStudentFeeReceiptList = [];
    selectedStudentDiscountList = [];
    tcList: Array<TransferCertificateNew> = [];
    isDeleteFromSessionEnabled = true;

    // Data from Parent Student Filter
    classList = [];
    sectionList = [];

    isLoading = false;
    
    isStudentListLoading = false;
    
    serviceAdapter: DeleteStudentServiceAdapter;
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
    studentParameterDocumentList: any[] = [];

    studentParameterValueList: any[] = [];   

    profileColumns;

    constructor(
        public studentService: StudentService,
        public subjectService: SubjectService,
        public examinationOldService: ExaminationService,
        public feeService: FeeService,
        public tcService: TCService,
        public studentOldService: StudentOldService,
        public classService: ClassService,
        public excelService: ExcelService,
        public schoolService: SchoolService,
        public printService: PrintService,
        public busStopService: BusStopService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new DeleteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.columnFilter = new ColumnFilter();

        this.backendData = new DeleteStudentBackendData();
        this.backendData.initialize(this);
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
    }

    handleStudentListSelection(value): void{
        this.studentFullProfileList.forEach((student) => {
            if(student.dbId == value[0][0].id) {
                student.isSearchedByName = true;
            }
        });
        this.handleStudentDisplay();
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }

    getParameterValue(student, parameter) {
        try {
            return this.studentParameterValueList.find(
                    (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
                ).value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    getFilteredStudentParameterList = () => this.studentParameterList.filter((x) => x.parameterType === 'FILTER');

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    initializeStudentFullProfileList(studentFullProfileList: any): any {
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach((studentFullProfile) => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selectProfile'] = false;
            studentFullProfile['newTransferCertificate'] = this.backendData.tcList.find(tc => tc.parentStudent == studentFullProfile.dbId);
            studentFullProfile['isDeletable'] = true;
            studentFullProfile['isDeletablechecked'] = false;
            studentFullProfile['isSearchedByName'] = false;
        });
        this.handleStudentDisplay();
    }

    getAdmissionSession(admissionSessionDbId: number): string {
        let admissionSession = null;
        this.session_list.every((session) => {
            if (session.id === admissionSessionDbId) {
                admissionSession = session.name;
                return false;
            }
            return true;
        });
        return admissionSession;
    }

    getBusStopName(busStopDbId: any) {
        let stopName = '';
        if (busStopDbId !== null) {
            this.busStopList.forEach((busStop) => {
                if (busStop.id === busStopDbId) {
                    stopName = busStop.stopName;
                    return;
                }
            });
        }
        return stopName;
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
            if (student.show) {
                student.selectProfile = true;
            }
        });
    }

    unselectAllStudents(): void {
       this.studentFullProfileList.forEach((student) => {
            if (student.show) {
                student.selectProfile = false;
            }
        });
    }

    getSelectedStudents() {
        let count = 0;
        this.studentFullProfileList.forEach((student) => {
            if (student.show && student.selectProfile) {
                ++count;
            }
        });
        return count;
    }

    getDeletableStudents() {
        let count = 0;
        this.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                ++count;
            }
        });
        return count;
    }

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every((section) => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach((student) => {

            if(student.isSearchedByName) {
                ++this.displayStudentNumber;
                student.show = true;
                student.selectProfile = false;
                student.serialNumber = ++serialNumber;
                return;
            }

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
            for (let x of this.getFilteredStudentParameterList()) {
                let flag = x.showNone;
                x.filterValues.forEach((filter) => {
                    flag = flag || filter.show;
                });
                if (flag) {
                    let parameterValue = this.getParameterValue(student, x);
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
            ++this.displayStudentNumber;
            student.show = true;
            student.selectProfile = false;
            student.serialNumber = ++serialNumber;
        });

        let checkDeletabilityStudentList = [];
        this.studentFullProfileList.forEach((student) => {
            if(student.show && !student.isDeletablechecked) {
                checkDeletabilityStudentList.push(student);
            }
        });
        
        if(checkDeletabilityStudentList.length > 0){
            this.serviceAdapter.checkDeletability(checkDeletabilityStudentList);
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
