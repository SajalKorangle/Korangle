
import { of as observableOf, Observable } from 'rxjs';
// import { timer } from 'rxjs/operators';
// import { flatMap } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, Route } from '@angular/router';
import { PreloadingStrategy } from '@angular/router';


import {DataStorage} from './classes/data-storage';

const routes: Routes = [
    {
        path: 'notification',
        loadChildren: 'app/modules/notification/notification.module#NotificationModule',
        // loadChildren: () => import('app/modules/students/student.module').then(m => m.StudentModule),
    },
    {
        path: 'students',
        loadChildren: 'app/modules/students/student.module#StudentModule',
        // loadChildren: () => import('app/modules/students/student.module').then(m => m.StudentModule),
    },
    {
        path: 'fees',
        loadChildren: 'app/modules/fees/fee.module#FeeModule',
        // loadChildren: () => import('app/modules/fees/fee.module').then(m => m.FeeModule),
    },
    {
        path: 'sms',
        loadChildren: 'app/modules/sms/sms.module#SmsModule',
    },
    {
        path: 'attendance',
        loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule',
    },
    {
        path: 'employees',
        loadChildren: 'app/modules/employee/employee.module#EmployeeModule',
    },
    {
        path: 'subjects',
        loadChildren: 'app/modules/subject/subject.module#SubjectModule',
    },
    {
        path: 'examinations',
        loadChildren: 'app/modules/examination/examination.module#ExaminationModule',
    },
    {
        path: 'salary',
        loadChildren: 'app/modules/salary/salary.module#SalaryModule',
    },
    {
        path: 'expenses',
        loadChildren: 'app/modules/expenses/expense.module#ExpenseModule',
    },
    {
        path: 'enquiries',
        loadChildren: 'app/modules/enquiry/enquiry.module#EnquiryModule',
    },
    {
        path: 'vehicle',
        loadChildren: 'app/modules/vehicle/vehicle.module#VehicleModule',
    },
    {
        path: 'job',
        loadChildren: 'app/modules/job/job.module#JobModule',
    },
    {
        path: 'user-settings',
        loadChildren: 'app/modules/user-settings/user-settings.module#UserSettingsModule',
        // loadChildren: () => import('app/modules/user-settings/user-settings.module').then(m => m.UserSettingsModule),
    },
    {
        path: 'parent',
        loadChildren: 'app/modules/parent/parent.module#ParentModule',
    },
    {
        path: 'school',
        loadChildren: 'app/modules/school/school.module#SchoolModule',
    },
    {
        path: 'marksheet',
        loadChildren: 'app/modules/marksheet/marksheet.module#MarksheetModule',
    },
    {
        path: 'print',
        outlet: 'print',
        children: [
            {path: 'students', loadChildren: 'app/modules/students/student.module#StudentModule'},
            {path: 'fees', loadChildren: 'app/modules/fees/fee.module#FeeModule'},
            {path: 'attendance', loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule'},
            {path: 'employees', loadChildren: 'app/modules/employee/employee.module#EmployeeModule'},
            {path: 'examinations', loadChildren: 'app/modules/examination/examination.module#ExaminationModule'},
            {path: 'salary', loadChildren: 'app/modules/salary/salary.module#SalaryModule'},
            {path: 'expenses', loadChildren: 'app/modules/expenses/expense.module#ExpenseModule'},
            {path: 'marksheet', loadChildren: 'app/modules/marksheet/marksheet.module#MarksheetModule'},
            {path: 'enquiries', loadChildren: 'app/modules/enquiry/enquiry.module#EnquiryModule'},

        ]
    }
];

export class CustomPreload implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        // console.log(route);
        if (route.path === 'user-settings') {
            return load();
        }
        let user = DataStorage.getInstance().getUser();
        let result = false;
        if (route.data && route.data.moduleName) {
            if(user.schoolList.find(school => {
                return school.moduleList.find(module => {
                    return module.path == route.data.moduleName && module.taskList.find(task => {
                        return task.path == route.path;
                    });
                }) || (school.studentList.length > 0 && route.data.moduleName === 'parent');
            })) {
                result = true;
            }
        } else {
            if(user.schoolList.find(school => {
                return school.moduleList.find(module => {
                    return module.path == route.path;
                }) || (school.studentList.length > 0 && route.path === 'parent');
            })) {
                result = true;
            }
        }
        // return result ? timer(10000).pipe(flatMap( _ => load())) : observableOf(null);
        return result ? load() : observableOf(null);
    }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
        routes,
        {
            preloadingStrategy: CustomPreload
        }
    )
  ],
  exports: [
      CommonModule,
      RouterModule,
  ],
    providers: [
        CustomPreload,
    ]
})

export class AppRoutingModule { }
