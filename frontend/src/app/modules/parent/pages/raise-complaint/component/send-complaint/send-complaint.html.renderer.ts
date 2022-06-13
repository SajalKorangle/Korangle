import { SendComplaintComponent } from './send-complaint.component';
import { isMobile } from '@classes/common';

export class SendComplaintHtmlRenderer {

    vm: SendComplaintComponent;

    constructor() { }

    /* Initialize Renderer */
    initializeRenderer(vm: SendComplaintComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

     /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobile()

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }  // Ends: isMobileApplication()
}
