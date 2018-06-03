
import {School} from './school';

import { EmitterService } from '../services/emitter.service';

export class User {

    id: number;
    username: string;
    email: string;
    isAuthenticated = false;
    jwt = '';

    activeSchool: any;

    schoolList: School[] = [];

    activeTask: any;
    activeModule: any;

    isLazyLoading: boolean = false;
    isPageLoading: boolean = false;

    emptyUserDetails(): void {
        this.username = null;
        this.id = null;
        this.email = null;
        this.isAuthenticated = false;
        this.jwt = '';
        this.activeSchool = null;
        this.schoolList = [];
        this.activeTask = null;
        this.activeModule = null;
        this.isLazyLoading = false;
        this.isPageLoading = false;
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
        console.log(data);
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.initializeSchoolList(data.schoolList);
        if (this.schoolList.length > 0) {
            this.activeSchool = this.schoolList[0];
            this.initializeTask();
        }
    }

    getSchoolCurrentSessionName(): string {
        if (this.activeSchool.currentSessionDbId==1) {
            return 'Session 2017-18';
        } else if (this.activeSchool.currentSessionDbId==2) {
            return 'Session 2018-19';
        }
        return '';
    }

    initializeTask(): void {
        if (this.activeSchool.moduleList.length > 0) {
            this.activeModule = this.activeSchool.moduleList[0];
            this.activeTask = this.activeModule.taskList[0];
        }
        EmitterService.get('initialize-router').emit('');
    }

    activateTask(task: any, module: any): void {
        this.activeTask = task;
        this.activeModule = module;
    }

}

/*
    demo, user1234
    brightstar, 123brightstar
    brighthindi, hindi123
    eklavya, ashta123
    anupreet, itisjp123
    madhav, lakhan123
    talent, innovative123
    champion, 123champ
    bhagatsingh, bhagat123
    nainish, akodia123
    devendra, 12345dev
    praveen, praveen5678
    prajapati, patipraja1
    rahul, tailor123
*/
