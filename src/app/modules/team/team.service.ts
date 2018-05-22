import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { CommonServiceRequirements } from '../../services/common-service-requirements';
// import {DataStorage} from '../../classes/data-storage';

@Injectable()
export class TeamService extends CommonServiceRequirements {

    // Permission

    getMemberPermissionList(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/user/' + data.userDbId + '/permissions';
        return super.getData(token, url);
    }

    giveMemberPermissions(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/user/' + data.userDbId + '/permissions';
        return super.putData(data['permissionList'], token, url)
    }

    // Module

    getSchoolModuleList(data, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/modules';
        return super.getData(token, url);
    }

    // Member

    createMember(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/members';
        return super.postData(data, token, url);
    }

    removeMember(data: any, token: any): Promise<any> {
        const url = '/team/members/' + data.dbId;
        return super.deleteData(token, url);
    }

    getSchoolMemberList(data, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/members';
        return super.getData(token, url);
    }

    // User

    getUserList(token: any): Promise<any> {
        const url = '/team/users';
        return super.getData(token, url);
    }

}
