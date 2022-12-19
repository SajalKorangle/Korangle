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
            possibleValueList: [],  // Possible Values of backendName
            isMandatory: false,  // Is Parameter Mandatory
            isIncluded: false,  // Is Parameter Included
            parameterType: null,  // Parameter Type
            filterValueList: [],  // Filter Value List
            isSelected: false,
            isEditable: false,
        },
        {
            id: S_NO,
            backendName: "serialNumber",
            backendDisplayName: "S No.",
            possibleValueList: [
                "s no.",
                "sno.",
                "serialNumber",
                "serial no.",
                "serialno.",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: true,
            isEditable: false,
        },
        {
            id: ID,
            backendName: "id",
            backendDisplayName: "Software ID",
            possibleValueList: [
                "id",
                "dbid",
                "s id",
                "sid",
                "software id",
                "softwareid",
                "student id",
                "studentid",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: true,
            isEditable: false,
        },
        {
            id: NAME,
            backendName: "name",
            backendDisplayName: "Student Name",
            possibleValueList: [
                "name",
                "student name",
                "studentname",
                "students name",
                "student's name",
                "studentsname",
                "student'sname",
                "name of student",
                "name student",
            ],
            isMandatory: true,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: true,
            isEditable: true,
        },
        {
            id: FATHER_NAME,
            backendName: "fathersName",
            backendDisplayName: "Father's Name",
            possibleValueList: [
                "father",
                "fathername",
                "fathersname",
                "fathers name",
                "father's name",
                "father'sname",
                "father name",
            ],
            isMandatory: true,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: true,
            isEditable: true,
        },
        {
            id: MOBILE_NUMBER,
            backendName: "mobileNumber",
            backendDisplayName: "Mobile Number",
            possibleValueList: [
                "mobilenumber",
                "mobile number",
                "mobile",
                "mobileno.",
                "mobile no.",
                "contactnumber",
                "contact number",
                "contact",
                "contactno.",
                "contact no.",
                "phonenumber",
                "phone number",
                "phoneno.",
                "phone no.",
                "phone",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: true,
            isEditable: false,
        },
        {
            id: SECOND_MOBILE_NUMBER,
            backendName: "secondMobileNumber",
            backendDisplayName: "Alternate Mobile Number",
            possibleValueList: [
                "secondmobilenumber",
                "second mobile number",
                "secondmobileno.",
                "second mobile no.",
                "second mobile",
                "alternatemobilenumber",
                "alternate mobile number",
                "alternatemobileno.",
                "alternate mobile no.",
                "alternate mobile",
                "secondcontactnumber",
                "second contact number",
                "secondcontactno.",
                "second contact no.",
                "second contact",
                "alternatecontactnumber",
                "alternate contact number",
                "alternatecontactno.",
                "alternate contact no.",
                "alternate contact",
                "second phone",
                "second phone no.",
                "secondphoneno.",
                "second phone number",
                "secondphonenumber",
                "alternate phone",
                "alternate phone no.",
                "alternatephoneno.",
                "alternate phone number",
                "alternatephonenumber",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: false,
            isEditable: false,
        },
        {
            id: SCHOLAR_NUMBER,
            backendName: "scholarNumber",
            backendDisplayName: "Scholar Number",
            possibleValueList: [
                "scholarnumber",
                "scholar number",
                "scholar",
                "scholarno.",
                "scholar no.",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: false,
        },
        {
            id: DATE_OF_BIRTH,
            backendName: "dateOfBirth",
            backendDisplayName: "Date of Birth",
            possibleValueList: [
                "dateofbirth",
                "date of birth",
                "dob",
                "birth date",
                "birthdate",
                "born date",
                "borndate",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "DATE",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: REMARK,
            backendName: "remark",
            backendDisplayName: "Remarks",
            possibleValueList: [
                "remark",
                "remarks",
                "note",
                "notes",
                "comment",
                "observe",
                "mention",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: MOTHER_NAME,
            backendName: "motherName",
            backendDisplayName: "Mother's Name",
            possibleValueList: [
                "mother",
                "mothername",
                "mother name",
                "mothersname",
                "mothers name",
                "mother's name",
                "mother'sname",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: GENDER,
            backendName: "gender",
            backendDisplayName: "Gender",
            possibleValueList: [
                "gender",
                "sex",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            filterValueList: [
                "Male",
                "Female",
                "Other",
                "None",
            ],
            isSelected: false,
            isEditable: true,
        },
        {
            id: CASTE,
            backendName: "caste",
            backendDisplayName: "Caste",
            possibleValueList: [
                "caste",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: CATEGORY,
            backendName: "newCategoryField",
            backendDisplayName: "Category",
            possibleValueList: [
                "category",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            filterValueList: [
                "SC",
                "ST",
                "OBC",
                "Gen.",
                "None"
            ],
            isSelected: false,
            isEditable: true,
        },
        {
            id: RELIGION,
            backendName: "newReligionField",
            backendDisplayName: "Religion",
            possibleValueList: [
                "religion",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "FILTER",
            filterValueList: [
                "Hinduism",
                "Islam",
                "Christianity",
                "Jainism",
                "None"
            ],
            isSelected: false,
            isEditable: true,
        },
        {
            id: FATHER_OCCUPATION,
            backendName: "fatherOccupation",
            backendDisplayName: "Father's Occupation",
            possibleValueList: [
                "fatheroccupation",
                "father occupation",
                "occupation",
                "father's occupation",
                "father'soccupation",
                "fathersoccupation",
                "fathers occupation",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: ADDRESS,
            backendName: "address",
            backendDisplayName: "Address",
            possibleValueList: [
                "address",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: FAMILY_SSMID,
            backendName: "familySSMID",
            backendDisplayName: "Family SSMID",
            possibleValueList: [
                "familyssmid",
                "family ssmid",
                "fmid",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: CHILD_SSMID,
            backendName: "childSSMID",
            backendDisplayName: "Child SSMID",
            possibleValueList: [
                "childssmid",
                "child ssmid",
                "studentssmid",
                "student ssmid",
                "sssmid",
                "cssmid",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "NUMBER",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: BANK_NAME,
            backendName: "bankName",
            backendDisplayName: "Bank Name",
            possibleValueList: [
                "bankname",
                "bank name",
                "bank",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
        },
        {
            id: BANK_IFSC_CODE,
            backendName: "bankIfscCode",
            backendDisplayName: "IFSC Code",
            possibleValueList: [
                "bankifsccode",
                "bank ifsc code",
            ],
            isMandatory: false,
            isIncluded: false,
            parameterType: "TEXT",
            filterValueList: [],
            isSelected: false,
            isEditable: true,
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
