import { School } from './school';

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

    session_list: {
        id: number,
        startDate: string,
        endDate: string,
        orderNumber: number,
        name: string
    }[] = [];

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

    // initializeRouterCallback: (value: any) => void | null = null;

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
                path: 'suggest_feature',
                title: 'Suggest Feature',
            },
            {
                path: 'create_school',
                title: 'Create School',
            },
            {
                path: 'view_devices',
                title: 'View Devices',
            },
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
        schoolList.forEach((school) => {
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
        this.session_list = data.session_list;
        this.initializeSchoolList(data.schoolList);
        this.activeSchool = this.schoolList[0];
        this.initializeTask();
    }

    // This function will be called after
    // 1. clicking of back button
    // 2. clicking of refresh button
    // 3. when session has changed
    // 4. when school has changed
    // 5. when role has changes
    initializeTask(): void {
        let urlPath = window.location.pathname;
        const [, , modulePath, taskPath] = urlPath.split('/');
        let urlParams = new URLSearchParams(window.location.search);
        let module: any = null;
        let task: any = null;
        if (!this.activeSchool) {
            switch (modulePath) {
                case '/':
                    module = null;
                    break;
                case 'user-settings':
                    this.activeSchool.role = urlParams.get('role') || 'Employee';
                    module = this.settings;
                    break;
                case 'notification':
                    this.activeSchool.role = urlParams.get('role') || 'Employee';
                    module = this.notification;
                    break;
            }
            if (module) {
                task = module.taskList.find((t) => t.path == taskPath) || null;
            }
        } else if (this.checkUserSchoolSessionPermission(urlParams)) {
            // checking the school id  and session id in the url is valid for this user
            switch (
                modulePath // from here we are populating module
            ) {
                // if the user refreshes the notification or user - settings
                // (i.e) we dont have these two in our user's active school module list

                case '/':
                    module = null;
                    break;
                case 'user-settings':
                    this.activeSchool.role = urlParams.get('role') || 'Employee';
                    module = this.settings;
                    break;
                case 'notification':
                    this.activeSchool.role = urlParams.get('role') || 'Employee';
                    module = this.notification;
                    break;

                // in case of parent, the modules are in  parentModuleList ( refreshing their students task lists are not handled yet)
                case 'parent':
                    // if only the active school has student list then we can change the role
                    if (this.activeSchool.studentList.length > 0) {
                        this.activeSchool.role = 'Parent';
                        if (urlParams.get('student_id') != undefined) {
                            module = this.activeSchool.studentList.find((s) => s.id == Number(urlParams.get('student_id')));
                        } else {
                            module = this.activeSchool.parentModuleList.some((parentModule) => parentModule.taskList.some((t) => t.path == taskPath))
                                ? this.activeSchool.parentModuleList.find((parentModule) => parentModule.taskList.some((t) => t.path == taskPath))
                                : undefined;
                        }
                    }
                    break;

                // What if a url parameter contains a different school id and the active school is different from that.
                // Is this case possible? Maybe when a url is entered into the address bar and user data has just come from backend
                // active school is populated in initializeUserData function which doesn't match the urlParam. But we are changing the
                // activeSchool in checkUserSchoolSessionPermission function, that should take care of such scenarios.
                // activeSchool should always be handled by url for a good architecture implementation !!!

                // for employee
                default:
                    module = this.activeSchool.moduleList.find((m) => m.path == modulePath) || null;
            }
            if (module) {
                // if module doesn't exist redirect to default school notification page
                task = module.taskList.find((t) => t.path == taskPath) || null;
            }
        }

        if (module == null || task == null) {
            module = this.notification;
            task = this.notification.taskList[0];
        }

        module.showTaskList = true;
        this.populateSectionAndRoute(task, module);
    }

    checkUserSchoolSessionPermission(urlParams: any): boolean {
        const school = this.schoolList.find((s) => s.dbId == Number(urlParams.get('school_id')));
        let maxSessionID = 0;
        this.session_list.forEach((session) => {
            maxSessionID = Math.max(maxSessionID, session.id);
        });
        if (school != undefined && Number(urlParams.get('session')) > 0 && Number(urlParams.get('session')) <= maxSessionID) {
            this.activeSchool = school;
            if (this.activeSchool.currentSessionDbId != Number(urlParams.get('session')) && this.checkChangeSession()) {
                this.activeSchool.currentSessionDbId = Number(urlParams.get('session'));
            }
            return true; // if both are valid returns true
        } else {
            // if the school id or session id is not valid redirects him to his default school's notification page
            return false;
        }
    }

    checkChangeSession() {
        return (
            this.activeSchool &&
            this.activeSchool.moduleList.find((module) => {
                return (
                    module.path == 'school' &&
                    module.taskList.find((task) => {
                        return task.path == 'change_session';
                    }) != undefined
                );
            }) != undefined
        );
    }

    populateSectionAndRoute(task: any, module: any): void {
        let queryParams = {};
        if (this.activeSchool) {
            queryParams = { school_id: this.activeSchool.dbId, session: this.activeSchool.currentSessionDbId };
        }
        if (module.path === 'user-settings' || module.path === 'notification') {
            this.section = {
                route: module.path,
                subRoute: task.path,
                title: module.title,
                subTitle: task.title,
            };
            queryParams['role'] = this.activeSchool.role;
        } else if (this.activeSchool.role === 'Parent') {
            this.section = {
                route: 'parent',
                subRoute: task.path,
                title: module.name,
                subTitle: task.title,
                student: module,
            };
            if (!this.activeSchool.parentModuleList.some((parentModule) => parentModule.taskList.some((t) => t.path == task.path))) {
                queryParams['student_id'] = module.id;
            }
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
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            if (['school_id', 'session', 'student_id'].includes(key))
                return;
            queryParams[key] = value;
        });
        EmitterService.get('initialize-router').emit({ queryParams: queryParams });
        console.log("Calling callback");
    }

}

/*
    9926085773
    6264439636
*/
