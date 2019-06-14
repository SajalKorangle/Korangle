
import { of as observableOf, Observable } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, Route } from '@angular/router';
import { PreloadingStrategy } from '@angular/router';


import {DataStorage} from './classes/data-storage';

const routes: Routes = [
    {
        path: 'examinations',
        loadChildren: 'app/modules/examination/examination.module#ExaminationModule',
    },
    {
        path: 'subjects',
        loadChildren: 'app/modules/subject/subject.module#SubjectModule',
    },
    {
        path: 'salary',
        loadChildren: 'app/modules/salary/salary.module#SalaryModule',
    },
    {
        path: 'job',
        loadChildren: 'app/modules/job/job.module#JobModule',
    },
    {
        path: 'user-settings',
        loadChildren: 'app/modules/user-settings/user-settings.module#UserSettingsModule',
    },
    {
        path: 'parent',
        loadChildren: 'app/modules/parent/parent.module#ParentModule',
    },
    {
        path: 'students',
        loadChildren: 'app/modules/students/student.module#StudentModule',
    },
    {
        path: 'school',
        loadChildren: 'app/modules/school/school.module#SchoolModule',
    },
    {
        path: 'attendance',
        loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule',
    },
    {
        path: 'marksheet',
        loadChildren: 'app/modules/marksheet/marksheet.module#MarksheetModule',
    },
    {
        path: 'expenses',
        loadChildren: 'app/modules/expenses/expense.module#ExpenseModule',
    },
    /*{
        path: 'fees-old',
        loadChildren: 'app/modules/fees-second/fee.module#FeeModule',
    },*/
    {
        path: 'fees',
        loadChildren: 'app/modules/fees/fee.module#FeeModule',
    },
    {
        path: 'sms',
        loadChildren: 'app/modules/sms/sms.module#SmsModule',
    },
    {
        path: 'employees',
        loadChildren: 'app/modules/employee/employee.module#EmployeeModule',
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
        path: 'team',
        loadChildren: 'app/modules/team/team.module#TeamModule',
    },
    {
        path: 'print',
        outlet: 'print',
        children: [
            {path: 'students', loadChildren: 'app/modules/students/student.module#StudentModule'},
            {path: 'employees', loadChildren: 'app/modules/employee/employee.module#EmployeeModule'},
            {path: 'attendance', loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule'},
            {path: 'examinations', loadChildren: 'app/modules/examination/examination.module#ExaminationModule'},
            {path: 'salary', loadChildren: 'app/modules/salary/salary.module#SalaryModule'},
            {path: 'fees', loadChildren: 'app/modules/fees/fee.module#FeeModule'}
        ]
    }
];

export class CustomPreload implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        if (route.path === 'settings') {
            return load();
        }
        let user = DataStorage.getInstance().getUser();
        let result = false;
        user.schoolList.every(school => {
            school.moduleList.every( module => {
                if (module.path === route.path) {
                    result = true;
                    return false;
                }
                return true;
            });
            if (school.studentList.length > 0 && route.path === 'parent') {
                result = true;
            }
            if (result) {
                return false;
            }
            return true;
        });
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
