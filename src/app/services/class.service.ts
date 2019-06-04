import {Injectable} from '@angular/core';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class ClassService extends CommonServiceRequirements {

    // private classSectionListUrl = '/class/class_section_list/';

    classList: any;
    sectionList: any;

    getClassSectionList(data, token: any): Promise<any> {
        return super.getData(token, '/class/class_section_list/sessions/' + data.sessionDbId);
    }

    getClassList(token: any): Promise<any> {
        if (!this.classList) {
            this.classList = super.getData(token, '/class/classes');
        }
        return this.classList;
    }

    getSectionList(token: any): Promise<any> {
        if (!this.sectionList) {
            this.sectionList = super.getData(token, '/class/sections');
        }
        return this.sectionList;
    }

}

