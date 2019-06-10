import {Injectable} from '@angular/core';

import { CommonServiceRequirements } from './common-service-requirements';
import {CacheStorage} from "../classes/cache-storage";

@Injectable()
export class ClassService extends CommonServiceRequirements {

    // private classSectionListUrl = '/class/class_section_list/';

    getClassSectionList(data, token: any): Promise<any> {
        return super.getData(token, '/class/class_section_list/sessions/' + data.sessionDbId);
    }

    getClassList(token: any): Promise<any> {
        if (!CacheStorage.getInstance().classList) {
            return super.getData(token, '/class/classes').then(response => {
                CacheStorage.getInstance().classList = response;
                return response;
            });
        }
        return Promise.resolve(CacheStorage.getInstance().classList);
    }

    getSectionList(token: any): Promise<any> {
        if (!CacheStorage.getInstance().sectionList) {
            return super.getData(token, '/class/sections').then(response => {
                CacheStorage.getInstance().sectionList = response;
                return response;
            });
        }
        return Promise.resolve(CacheStorage.getInstance().sectionList);
    }

}

