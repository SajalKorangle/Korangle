import { Component, OnInit } from '@angular/core';
import { DeleteStudentServiceAdapter } from './delete-student.service.adapter';
import { DeleteStudentHtmlRenderer } from './delete-student.html.renderer';
import { DeleteStudentBackendData } from './delete-student.backend.data';
import { DataStorage } from '../../../../classes/data-storage';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';

class ColumnFilter {
    showSerialNumber = true;
    showProfileImage = false;
    showName = true;
    showClassName = true;
    showSectionName = true;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = false;
    showSecondMobileNumber = false;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = false;
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
    providers: [StudentOldService],
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
    studentParameterDocumentList: any[] = [];

    studentParameterValueList: any[] = [];   

    classStudentSelectList = ['Class', 'Student'];
    currentClassStudentFilter;

    deletablitySelectList = ['All Students', 'Deletable Students', 'Non-Deletable Students'];
    currentDeletablityFilter;

    profileColumns;

    constructor(
        public studentOldService: StudentOldService,
    ) {}

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
        this.htmlRenderer.handleStudentDisplay();
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

}
