import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee.component';
import { PrintEmployeeExpCertiComponent } from './print/print-employee-exp-certi/print-employee-exp-certi.component';
import { PrintEmployeeICardsComponent } from './print/print-employee-i-card/print-employee-i-cards.component';
import { PRINT_EMPLOYEE_EXP_CERT, PRINT_EMPLOYEE_I_CARD, PRINT_EMPLOYEE_LIST } from '../../print/print-routes.constants';
import { PrintEmployeeListComponent } from './print/print-employee-list/print-employee-list.component';

const routes: Routes = [
    {
        path: 'update_profile',
        loadChildren: 'app/modules/employee/pages/update-profile/update-profile.module#UpdateProfileModule',
        data: {moduleName: 'employee'},
    },
    {
        path: 'view_all',
        loadChildren: 'app/modules/employee/pages/view-all/view-all.module#ViewAllModule',
        data: {moduleName: 'employee'},
    },
    {
        path: 'add_employee',
        loadChildren: 'app/modules/employee/pages/add-employee/add-employee.module#AddEmployeeModule',
        data: {moduleName: 'employee'},
    },
    {
        path: 'assign_task',
        loadChildren: 'app/modules/employee/pages/assign-task/assign-task.module#AssignTaskModule',
        data: {moduleName: 'employee'},
    },
    {
        path: 'employee_i_card',
        loadChildren: 'app/modules/employee/pages/i-cards/i-cards.module#ICardsModule',
        data: {moduleName: 'employee'},
    },
    {
        path: 'employee_experience_certi',
        loadChildren: 'app/modules/employee/pages/experience-certi/experience-certi.module#ExperienceCertiModule',
        data: {moduleName: 'employee'},
    },

    {
        path: '',
        component: EmployeeComponent,
    },
    {
        path: PRINT_EMPLOYEE_EXP_CERT,
        component: PrintEmployeeExpCertiComponent,
    },
    {
        path: PRINT_EMPLOYEE_I_CARD,
        component: PrintEmployeeICardsComponent,
    },
    {
        path: PRINT_EMPLOYEE_LIST,
        component: PrintEmployeeListComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class EmployeeRoutingModule { }
