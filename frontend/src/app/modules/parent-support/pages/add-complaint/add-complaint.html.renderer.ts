import { AddComplaintComponent } from './add-complaint.component';

export class AddComplaintHtmlRenderer {

    vm: AddComplaintComponent;

    constructor() {
    }

    /* Initialize Renderer */
    initializeRenderer(vm: AddComplaintComponent): void {
        this.vm = vm;
    }  // Ends: initializeRenderer()

     /* For mobile-browser */
    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }  // Ends: isMobile()
}
