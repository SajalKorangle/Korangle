import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, Route } from '@angular/router';
import { PreloadAllModules, PreloadingStrategy } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {DataStorage} from './classes/data-storage';

const routes: Routes = [
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
        path: 'marksheet',
        loadChildren: 'app/modules/marksheet/marksheet.module#MarksheetModule',
    },
    {
        path: 'expenses',
        loadChildren: 'app/modules/expenses/expense.module#ExpenseModule',
    },
    {
        path: 'fees',
        loadChildren: 'app/modules/fees-second/fee.module#FeeModule',
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
];

export class CustomPreload implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
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
        return result ? load() : Observable.of(null);
    }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
        routes,
        {preloadingStrategy: CustomPreload}
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
