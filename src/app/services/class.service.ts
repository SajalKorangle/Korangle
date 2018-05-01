import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class ClassService extends CommonServiceRequirements {

    // private classSectionListUrl = '/class/class_section_list/';

    getClassSectionList(data, token: any): Promise<any> {
        return super.getData(token, '/class/class_section_list/sessions/' + data.sessionDbId);
    }

    getClassList(token: any): Promise<any> {
        return super.getData(token, '/class/classes')
    }

}

