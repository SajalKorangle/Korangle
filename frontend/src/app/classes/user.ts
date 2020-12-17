
import {School} from './school';

import { EmitterService } from '../services/emitter.service';

export class User {

    id: number;
    username: number;

    first_name: string;
    last_name: string;

    email: string;
    isAuthenticated = false;
    jwt = '';

    section: any;

    activeSchool: any;

    schoolList: School[] = [];

    videoUrl:string;

    isLazyLoading: boolean = false;

    emptyUserDetails(): void {
        this.username = null;
        this.first_name = null;
        this.last_name = null;
        this.id = null;
        this.email = null;
        this.isAuthenticated = false;
        this.jwt = '';
        this.activeSchool = null;
        this.schoolList = [];
        this.isLazyLoading = false;
        this.section = null;
    }

    checkAuthentication(): boolean {
        this.jwt = localStorage.getItem('schoolJWT');
        if (this.jwt === null || this.jwt.length === 0) {
            this.isAuthenticated = false;
            return false;
        } else {
            this.isAuthenticated = true;
            return true;
        }
    }

    initializeSchoolList(schoolList: any): void {
        this.schoolList = [];
        schoolList.forEach(school => {
            let schoolObject = new School();
            schoolObject.fromServerObject(school);
            this.schoolList.push(schoolObject);
        });
    }

    initializeUserData(data: any): void {
        this.id = data.id;
        this.username = data.username;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.initializeSchoolList(data.schoolList);
        this.activeSchool = this.schoolList[0];
        this.initializeTask();
    }

    getSchoolCurrentSessionName(): string {
        if (this.activeSchool.currentSessionDbId==1) {
            return 'Session 2017-18';
        } else if (this.activeSchool.currentSessionDbId==2) {
            return 'Session 2018-19';
        } else if (this.activeSchool.currentSessionDbId==3) {
            return 'Session 2019-20';
        } else if (this.activeSchool.currentSessionDbId==4) {
            return 'Session 2020-21';
        } else if (this.activeSchool.currentSessionDbId==5) {
            return 'Session 2021-22';
        }
        return '';
    }

    initializeTask(): void {
        /*if (this.schoolList.length > 0) {
            if (this.activeSchool.role === 'Parent') {
                this.populateSection(this.activeSchool.studentList[0].taskList[0], this.activeSchool.studentList[0]);
            } else if (this.activeSchool.role === 'Employee') {
                this.populateSection(this.activeSchool.moduleList[0].taskList[0], this.activeSchool.moduleList[0]);
            }
            EmitterService.get('initialize-router').emit('');
        } else {
            this.section = {
                route: 'user-settings',
                subRoute: 'update_profile',
                title: 'Settings',
                subTitle: 'Update Profile',
            };
            EmitterService.get('initialize-router').emit('');
        }*/
        this.section = {
            route: 'notification',
            subRoute: 'view_notification',
            title: 'Notification',
            subTitle: 'View Notification',
        };
        EmitterService.get('initialize-router').emit('');
    }

    populateSection(task: any, module: any): void {
        if (module.path === 'user-settings' || module.path === 'notification') {
            this.section = {
                route: module.path,
                subRoute: task.path,
                title: module.title,
                subTitle: task.title,
            };
        } else if (this.activeSchool.role === 'Parent') {
            this.section = {
                route: 'parent',
                subRoute: task.path,
                title: module.name,
                subTitle: task.title,
                student: module,
            };
        } else if (this.activeSchool.role === 'Employee') {
            this.section = {
                route: module.path,
                subRoute: task.path,
                title: module.title,
                subTitle: task.title,
            };
            if (task.videoUrl) {
                this.section['videoUrl'] = task.videoUrl;
            }
        }
    }

}

/*
    9926085773
    6264439636
*/
