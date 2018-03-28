import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class ClassService extends CommonServiceRequirements {

    // private classSectionListUrl = '/class/class_section_list/';

    getClassSectionList(data, token: any): Promise<any> {
        const url = '/class/class_section_list/sessions/' + data.sessionDbId;
        return super.getData(token, url);
    }

}
