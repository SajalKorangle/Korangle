import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'update_class',
        loadChildren: 'app/modules/class/pages/update-class/update-class.module#UpdateClassModule',
        data: {moduleName: 'update_class'},
    },
    {
        path: 'assign_class',
        loadChildren: 'app/modules/class/pages/assign-class/assign-class.module#AssignClassModule',
        data: {moduleName: 'assign_class'},
    },
    {
        path: 'set_rollnumber',
        loadChildren: 'app/modules/class/pages/set-rollnumber/set-rollnumber.module#SetRollnumberModule',
        data: {moduleName: 'set_rollnumber'},
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
export class ClassRoutingModule { }
