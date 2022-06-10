import { AddComplaintComponent } from './add-complaint.component';
import { isMobile } from '@classes/common';

export class AddComplaintHtmlRenderer {

    vm: AddComplaintComponent;

    constructor() {
    }

    /* Initialize Renderer */
    initializeRenderer(vm: AddComplaintComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobileBrowser()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }  // Ends: isMobileApplication()
}
