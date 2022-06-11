import { TotalCollectionComponent } from './total-collection.component';
import { isMobile } from '../../../../classes/common';

export class TotalCollectionHtmlRenderer {

    vm: TotalCollectionComponent;

    constructor() { }

    initializeRenderer(vm: TotalCollectionComponent): void {
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
