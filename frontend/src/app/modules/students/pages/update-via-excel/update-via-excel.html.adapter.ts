import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';
import { ClassSection } from './update-via-excel.models';

import {
    SELECT_PARAMETER,
    S_NO,
    ID,
    NAME,
    FATHER_NAME,
    MOBILE_NUMBER,
    SECOND_MOBILE_NUMBER,
    SCHOLAR_NUMBER,
    DATE_OF_BIRTH,
    REMARK,
    MOTHER_NAME,
    GENDER,
    CASTE,
    CATEGORY,
    RELIGION,
    FATHER_OCCUPATION,
    ADDRESS,
    FAMILY_SSMID,
    CHILD_SSMID,
    BANK_NAME,
    BANK_IFSC_CODE,
    BANK_ACCOUNT_NUMBER,
    AADHAR_NUMBER,
    BLOOD_GROUP,
    FATHER_ANNUAL_INCOME,
    CURRENT_BUS_STOP,
    RTE,
    DATE_OF_ADMISSION,
    ADMISSION_CLASS,
    SECTION,
    CLASS,
    ROLL_NUMBER,
    ADMISSION_SESSION,
    CUSTOM_PARAMETER,
} from './constants/student-properties';


export class UpdateViaExcelHtmlAdapter {

    vm: UpdateViaExcelComponent;

    // Starts :- Tab Names
    DOWNLOAD_TEMPLATE_TAB = "DOWNLOAD TEMPLATE TAB";
    UPLOAD_SHEET_TAB = "UPLOAD SHEET TAB";
    // Ends :- Tab Names

    isLoading: boolean = false;
    activeTab: string;

    classSectionList: ClassSection[] = [];

    columnHeadersDetailList: any = [
        {
            id: SELECT_PARAMETER,  // Header Id
            backendName: "Select Parameter",  // Database Property Name
            backendDisplayName: "Select Parameter",  // Display (Frontend) Name of backendName
            isMandatory: false,  // Is Parameter Mandatory
            isIncluded: false,  // Is Parameter Included
            parameterType: null,  // Parameter Type
            isSelected: false,
            isEditable: false,
        },
        {
            id: S_NO,
            backendName: "serialNumber",
            backendDisplayName: "S No.",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: true,
            isEditable: false,
        },
        {
            id: ID,
            backendName: "id",
            backendDisplayName: "Software ID",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: true,
            isEditable: false,
        },
        {
            id: NAME,
            backendName: "name",
            backendDisplayName: "Student Name",
            isMandatory: true,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: true,
            isEditable: true,
        },
        {
            id: FATHER_NAME,
            backendName: "fathersName",
            backendDisplayName: "Father's Name",
            isMandatory: true,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: true,
            isEditable: true,
        },
        {
            id: MOBILE_NUMBER,
            backendName: "mobileNumber",
            backendDisplayName: "Mobile Number",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: true,
            isEditable: false,
        },
        {
            id: SECOND_MOBILE_NUMBER,
            backendName: "secondMobileNumber",
            backendDisplayName: "Alternate Mobile Number",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: false,
            isEditable: false,
        },
        {
            id: SCHOLAR_NUMBER,
            backendName: "scholarNumber",
            backendDisplayName: "Scholar Number",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: false,
        },
        {
            id: DATE_OF_BIRTH,
            backendName: "dateOfBirth",
            backendDisplayName: "Date of Birth",
            isMandatory: false,
            isIncluded: false,
            parameterType: "DATE",
            isSelected: false,
            isEditable: true,
        },
        {
            id: REMARK,
            backendName: "remark",
            backendDisplayName: "Remarks",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: MOTHER_NAME,
            backendName: "motherName",
            backendDisplayName: "Mother's Name",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: GENDER,
            backendName: "gender",
            backendDisplayName: "Gender",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: CASTE,
            backendName: "caste",
            backendDisplayName: "Caste",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: CATEGORY,
            backendName: "newCategoryField",
            backendDisplayName: "Category",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: RELIGION,
            backendName: "newReligionField",
            backendDisplayName: "Religion",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: FATHER_OCCUPATION,
            backendName: "fatherOccupation",
            backendDisplayName: "Father's Occupation",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: ADDRESS,
            backendName: "address",
            backendDisplayName: "Address",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: FAMILY_SSMID,
            backendName: "familySSMID",
            backendDisplayName: "Family SSMID",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: CHILD_SSMID,
            backendName: "childSSMID",
            backendDisplayName: "Child SSMID",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: BANK_NAME,
            backendName: "bankName",
            backendDisplayName: "Bank Name",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: BANK_IFSC_CODE,
            backendName: "bankIfscCode",
            backendDisplayName: "IFSC Code",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: BANK_ACCOUNT_NUMBER,
            backendName: "bankAccountNum",
            backendDisplayName: "Bank Ac. Number",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: AADHAR_NUMBER,
            backendName: "aadharNum",
            backendDisplayName: "Aadhar Number",
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: BLOOD_GROUP,
            backendName: "bloodGroup",
            backendDisplayName: "Blood Group",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: FATHER_ANNUAL_INCOME,
            backendName: "fatherAnnualIncome",
            backendDisplayName: "Father's Annual Income",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: true,
        },
        {
            id: CURRENT_BUS_STOP,
            backendName: "currentBusStop",
            backendDisplayName: "Bus Stop",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: RTE,
            backendName: "rte",
            backendDisplayName: "RTE",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: true,
        },
        {
            id: ADMISSION_SESSION,
            backendName: "admissionSession",
            backendDisplayName: "Admission Session",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: false,
        },
        {
            id: ADMISSION_CLASS,
            backendName: "parentAdmissionClass",
            backendDisplayName: "Admission Class",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: false,
        },
        {
            id: DATE_OF_ADMISSION,
            backendName: "dateOfAdmission",
            backendDisplayName: "Date of Admission",
            isMandatory: false,
            isIncluded: false,
            parameterType: "DATE",
            isSelected: false,
            isEditable: true,
        },
        {
            id: SECTION,
            backendName: "parentDivision",
            backendDisplayName: "Division",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: false,
            isEditable: false,
        },
        {
            id: CLASS,
            backendName: "parentClass",
            backendDisplayName: "Class",
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            isSelected: true,
            isEditable: false,
        },
        {
            id: ROLL_NUMBER,
            backendName: "rollNumber",
            backendDisplayName: "Roll No.",
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            isSelected: false,
            isEditable: false,
        },
    ];

    constructor() {
        this.activeTab = this.DOWNLOAD_TEMPLATE_TAB;
    }

    initializeAdapter(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    /* Set Active Tab */
    setActiveTab(tabName) {
        this.activeTab = tabName;
    }  //  Ends: setActiveTab()

    /* Select All Classes */
    selectAllClasses() {
        this.classSectionList.forEach((classSection) => {
            classSection.sectionList.forEach((section) => section.selected = true);
        });
    }
    //  Ends: selectAllClasses()

    /* Unselect All Classes */
    unselectAllClasses() {
        this.classSectionList.forEach((classSection) => {
            classSection.sectionList.forEach((section) => section.selected = false);
        });
    }
    //  Ends: unselectAllClasses()

    /* Select All Columns */
    selectAllColumns() {
        this.columnHeadersDetailList.forEach((columnHeader, idx) => {
            columnHeader.isSelected = true;
        });
    }  //  Ends: selectAllColumns()

    /* Unselect All Columns */
    unselectAllColumns() {
        this.columnHeadersDetailList.forEach((columnHeader) => {
            columnHeader.isSelected = false;
        });
    }  //  Ends: unselectAllColumns()

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 768) {
            return false;
        }
        return true;
    }
    // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }
    // Ends: isMobileApplication()

}
