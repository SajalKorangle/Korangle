import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from './common-service-requirements';

@Injectable()
export class ClassService extends CommonServiceRequirements {

    private classSectionListUrl = '/class/class_section_list/';

    getClassSectionList(token: any): Promise<any> {
        return super.getData(token, this.classSectionListUrl);
    }

}
