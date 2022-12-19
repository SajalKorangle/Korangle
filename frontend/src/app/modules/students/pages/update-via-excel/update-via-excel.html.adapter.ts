import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';
import { ClassSection } from './update-via-excel.models';


export class UpdateViaExcelHtmlAdapter {

    vm: UpdateViaExcelComponent;

    // Starts :- Tab Names
    DOWNLOAD_TEMPLATE_TAB = "DOWNLOAD TEMPLATE TAB";
    UPLOAD_SHEET_TAB = "UPLOAD SHEET TAB"
    // Ends :- Tab Names

    isLoading: boolean = false;
    activeTab: string;

    classSectionList: ClassSection[] = [];

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
