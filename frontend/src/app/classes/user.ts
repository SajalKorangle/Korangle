
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

    isLazyLoading: boolean = false;

    notification = {
        path: 'notification',
        title: 'Notification',
        icon: 'notifications_active',
        showTaskList: false,
        taskList: [
            {
                path: 'view_notification',
                title: 'View Notification',
            },
        ],
    };

    settings = {
        path: 'user-settings',
        title: 'Settings',
        icon: 'settings',
        showTaskList: false,
        taskList: [
            {
                path: 'update_profile',
                title: 'Update Profile',
            },
            {
                path: 'change_password',
                title: 'Change Password',
            },
            {
                path: 'contact_us',
                title: 'Contact Us',
            },
            {
                path: 'create_school',
                title: 'Create School',
            }
        ],
    };

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

        let urlPath = window.location.pathname;
        const modulePath = urlPath.split('/')[1];
        const taskPath = urlPath.split('/')[2];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let urlActiveSchool: any;

        if (urlPath == '/') { // on user login the path comes with '/' so on login showing notification page

            this.populateSection(this.notification.taskList[0], this.notification);
            EmitterService.get('initialize-router').emit('');

        } else if (modulePath == 'user-settings' || modulePath == 'notification') {  // if the user refreshes the notification or user - settings (i.e) we dont have these two in our user's module list

            let taskList: any;
            let module: any;
            let selectedTask: any = undefined;
            if (modulePath == 'user-settings') {
                module = this.settings;
            } else {
                module = this.notification;
            }
            taskList = module.taskList;
            taskList.some(task => {
                if (task.path == urlPath.split('/')[2]) {
                    selectedTask = task;
                }
            });

            // checking the school id in the url is valid for this user
            const validSchool = this.schoolList.some(function (school) {
                urlActiveSchool = school;
                return school.dbId === Number(urlParams.get('school_id'));
            });

            // if school and session are valid then showing the page
            if (validSchool && Number(urlParams.get('session')) > 0 && Number(urlParams.get('session')) <= 5) {
                this.activeSchool = urlActiveSchool;
                this.activeSchool.currentSessionDbId = Number(urlParams.get('session'));
                this.populateSection(selectedTask, module);
                module.showTaskList = true;
                EmitterService.get('initialize-router').emit('');
            } else {  // else redirecting him to his default school and session
                this.populateSection(this.notification.taskList[0], this.notification);
                EmitterService.get('initialize-router').emit('');
            }

        } else {  // other than notification and user-settings come here

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const school_id = Number(urlParams.get('school_id'));
            const session_id = Number(urlParams.get('session'));

            // iterating through schoolList if the module and task are valid
            const taskValid = this.schoolList.some(school => {
                if (school.dbId == school_id && session_id > 0 && session_id <= 5) {
                    return school.moduleList.some(module => {
                        if (module.path == modulePath) {
                            return module.taskList.some(task => {
                                if (task.path == taskPath) {
                                    // if the school is valid and then the module and task are valid for that particular school user show him the page
                                    this.activeSchool = school;
                                    this.activeSchool.currentSessionDbId = session_id;
                                    this.populateSection(task, module);
                                    EmitterService.get('initialize-router').emit('');
                                    module.showTaskList = true;
                                    return true;
                                }
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
            if (!taskValid) { // if the task page or module or school id is not valid redirects him to his default school notification page
                this.populateSection(this.notification.taskList[0], this.notification);
                EmitterService.get('initialize-router').emit('');
            }
        }
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
