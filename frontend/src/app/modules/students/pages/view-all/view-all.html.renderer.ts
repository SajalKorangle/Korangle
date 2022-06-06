import { ViewAllComponent } from './view-all.component';
import { isMobile } from '../../../../classes/common';

export class ViewAllHtmlRenderer {

    vm: ViewAllComponent;

    constructor() { }

    initializeRenderer(vm: ViewAllComponent): void {
        this.vm = vm;
    }

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }
}
