import {Injectable} from '@angular/core';



import { CommonServiceRequirements } from '../../services/common-service-requirements';
// import {DataStorage} from '../../classes/data-storage';

@Injectable()
export class TeamService extends CommonServiceRequirements {

    // Permission

    /*getMemberPermissionList(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/user/' + data.userDbId + '/permissions';
        return super.getData(token, url);
    }

    giveMemberPermissions(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/user/' + data.userDbId + '/permissions';
        return super.putData(data['permissionList'], token, url)
    }*/

    // Member

    /*createMember(data: any, token: any): Promise<any> {
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
    }*/

    // Module

    getSchoolModuleList(data: any, token: any): Promise<any> {
        const url = '/team/school/' + data.schoolDbId + '/modules';
        return super.getData(token, url);
    }

    getLatestModuleList(token: any): Promise<any> {
        const url = '/team/modules?latest=';
        return super.getData(token, url);
    }

    // Access
    create_school_access_batch(data: any, token: any): Promise<any> {
        const url = '/team/access/batch';
        return super.postData(data, token, url);
    }

    // Access
    get_task_list(token: any): Promise<any> {
        const url = '/team/tasks';
        return super.getData(token, url);
    }

    // User

    /*getUserList(token: any): Promise<any> {
        const url = '/team/users';
        return super.getData(token, url);
    }*/

}
