import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';
import { ClassSection, ColumnHeadersDetail } from './update-via-excel.models';


export class UpdateViaExcelHtmlAdapter {

    vm: UpdateViaExcelComponent;

    // Starts :- Tab Names
    DOWNLOAD_TEMPLATE_TAB = "DOWNLOAD TEMPLATE TAB";
    UPLOAD_SHEET_TAB = "UPLOAD SHEET TAB";
    // Ends :- Tab Names

    isLoading: boolean = false;
    activeTab: string;

    classSectionList: ClassSection[] = [];

    columnHeadersDetailList: ColumnHeadersDetail[] = [
        {
            displayName: "S No.",
            isSelected: true,
        },
        {
            displayName: "Software ID",
            isSelected: true,
        },
        {
            displayName: "Student Name",
            isSelected: true,
        },
        {
            displayName: "Father's Name",
            isSelected: true,
        },
        {
            displayName: "Mobile Number",
            isSelected: true,
        },
        {
            displayName: "Alternate Mobile Number",
            isSelected: false,
        },
        {
            displayName: "Scholar Number",
            isSelected: false,
        },
        {
            displayName: "Date of Birth",
            isSelected: false,
        },
        {
            displayName: "Remarks",
            isSelected: false,
        },
        {
            displayName: "Mother's Name",
            isSelected: false,
        },
        {
            displayName: "Gender",
            isSelected: false,
        },
        {
            displayName: "Caste",
            isSelected: false,
        },
        {
            displayName: "Category",
            isSelected: false,
        },
        {
            displayName: "Religion",
            isSelected: false,
        },
        {
            displayName: "Father's Occupation",
            isSelected: false,
        },
        {
            displayName: "Address",
            isSelected: false,
        },
        {
            displayName: "Family SSMID",
            isSelected: false,
        },
        {
            displayName: "Child SSMID",
            isSelected: false,
        },
        {
            displayName: "Bank Name",
            isSelected: false,
        },
        {
            displayName: "IFSC Code",
            isSelected: false,
        },
        {
            displayName: "Bank Account No.",
            isSelected: false,
        },
        {
            displayName: "Aadhar Number",
            isSelected: false,
        },
        {
            displayName: "Blood Group",
            isSelected: false,
        },
        {
            displayName: "Father's Annual Income",
            isSelected: false,
        },
        {
            displayName: "Bus Stop",
            isSelected: false,
        },
        {
            displayName: "RTE",
            isSelected: false,
        },
        {
            displayName: "Admission Session",
            isSelected: false,
        },
        {
            displayName: "Admission Class",
            isSelected: false,
        },
        {
            displayName: "Date of Admission",
            isSelected: false,
        },
        {
            displayName: "Division",
            isSelected: false,
        },
        {
            displayName: "Class",
            isSelected: true,
        },
        {
            displayName: "Roll No.",
            isSelected: false,
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
