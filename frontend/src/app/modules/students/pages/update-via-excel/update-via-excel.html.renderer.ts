import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';


export class UpdateViaExcelHtmlRenderer {

    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeRenderer(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    /* Get Section Name */
    getSectionName(classSection: any): boolean {
        let sectionLength = 0;
        this.vm.classSectionList.forEach((element) => {
            if (element.parentClassId == classSection.parentClassId && element.containsStudent) {
                sectionLength++;
            }
        });
        return (sectionLength > 1);
    }   // Ends: getSectionName()

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }   // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }   // Ends: isMobileApplication()
}
