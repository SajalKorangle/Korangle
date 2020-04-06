import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {AddEmployeeComponent } from './add-employee.component';
const routes: Routes = [
    {
        path: '',
        component: AddEmployeeComponent ,
    }
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
export class AddEmployeeRoutingModule { }
