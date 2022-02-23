import { UpdateProfileComponent } from './update-profile.component';
import { isMobile } from '../../../../classes/common';

export class UpdateProfileHtmlRenderer {

    vm: UpdateProfileComponent;

    constructor() { }

    initializeRenderer(vm: UpdateProfileComponent): void {
        this.vm = vm;
    }

    getSchoolCurrentSessionName(): string {
        return this.vm.sessionList.find((session) => {
            return session.id == this.vm.user.activeSchool.currentSessionDbId;
        }).name;

        return '';
    }

    /* For mobile-browser */
    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* For mobile-application */
    checkMobile(): boolean {
        return isMobile();
    }
}
