
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
                path: 'suggest_feature',
                title: 'Suggest Feature',
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
        const [,modulePath, taskPath] = urlPath.split('/');
        let urlParams = new URLSearchParams(window.location.search);
        let module: any;
        let task: any ;
        
        if(this.checkNewClient()){
            this.populateNewClient()
        }
        else{
            if (this.checkUserSchoolSessionPermission(urlParams)) { // checking the school id  and session id in the url is valid for this user
                switch (modulePath) { // from here i am population module
                    // if the user refreshes the notification or user - settings
                    // (i.e) we dont have these two in our user's active school module list

                    case '/':
                        module=undefined;
                        break;
                    case 'user-settings':
                        module = this.settings;
                        break;
                    case 'notification':
                        module = this.notification;
                        break;

                    // Review: You have written down that refreshing of student task list is not handled yet.
                    // Ye comment puraana hai, ya functionality abhi bhi nahi handle hui hai.

                    // in case of parent, the modules are in  parentModuleList ( refreshing their students task lists are not handled yet)
                    case 'parent':
                        // Review: Agar woh employee ke role se parent ke role me aa raha hai to? Permission hai dono ki uske paas.
                        // if only the active school has student list then we can change the role
                        if(this.activeSchool.studentList.length > 0) {
                            this.activeSchool.role='Parent';
                            if (urlParams.get('student_id') != undefined) {
                                module = this.activeSchool.studentList.find(s => s.id == Number(urlParams.get('student_id')));
                            } else {
                                // Review: agar path view_fee receipt ka nahi hua aur student id bhi undefined hai to?
                                // Aisa case is line tak pahunch sakta hai kya?
                                module = this.activeSchool.parentModuleList[0].taskList.some(t => t.path == taskPath) ? this.activeSchool.parentModuleList[0] : undefined;
                            }
                        }
                        break;
                    // for employee
                    default:
                        module = this.activeSchool.moduleList.find(m => m.path == modulePath);
                }
                if (module) { // if module doesn't exist redirect to default school notification page
                    task = module.taskList.find(t => t.path == taskPath);
                }
            }

            if (!module || !task) {
                module = this.notification;
                task = this.notification.taskList[0];
            }

            module.showTaskList = true;
            this.populateSectionAndRoute(task, module);
        }

    }
    
    checkNewClient():boolean{
        if (this.schoolList.length==0){
            return true;
        }  
        else{
            return false;
        }
    }
  
    populateNewClient(){
          this.section = {
              route: 'user-settings',
              subRoute: 'update_profile',
              title: 'Settings',
              subTitle: 'Update Profile',
          };
          EmitterService.get('initialize-router').emit('');
      }


    checkUserSchoolSessionPermission(urlParams:any): boolean {
        const school = this.schoolList.find(s => s.dbId == Number(urlParams.get('school_id')));
        if (school != undefined
            && Number(urlParams.get('session')) > 0
            && Number(urlParams.get('session')) <= 5) {
            this.activeSchool = school;
            if (this.activeSchool.currentSessionDbId != Number(urlParams.get('session'))
                && this.checkChangeSession()) {
                this.activeSchool.currentSessionDbId = Number(urlParams.get('session'));
            }
            return true; // if both are valid returns true
        } else { // if the school id or session id is not valid redirects him to his default school's notification page
            return false;
            // Review: yahan se false return hona chahiye tha na.
        }
    }

    checkChangeSession() {
        return this.activeSchool && this.activeSchool.moduleList.find(module => {
            return module.path=='school' && module.taskList.find(task => {
                return task.path=='change_session';
            }) != undefined;
        }) != undefined;
    }

    populateSectionAndRoute(task: any, module: any): void {
        if (this.checkNewClient()){
            if (module.path === 'user-settings'){
                this.section = {
                    route: module.path,
                    subRoute: task.path,
                    title: module.title,
                    subTitle: task.title,
                };
                EmitterService.get('initialize-router').emit("");
            }
        }
        else{  
            let queryParams={school_id: this.activeSchool.dbId, session: this.activeSchool.currentSessionDbId};
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
                if(!this.activeSchool.parentModuleList[0].taskList.some(t => t.path == task.path)){
                    queryParams['student_id']=module.id;
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
            EmitterService.get('initialize-router').emit({queryParams: queryParams});
        }
    }

}

/*
    9926085773
    6264439636
*/
