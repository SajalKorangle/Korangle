import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeworkComponent } from './homework.component';

const routes: Routes = [
    {
        path: 'issue_homework',
        loadChildren: 'app/modules/homework/pages/issue-homework/issue-homework.module#IssueHomeworkModule',
        data: {moduleName: 'homework'},
    },
    {
        path: 'check_homework',
        loadChildren: 'app/modules/homework/pages/check-homework/check-homework.module#CheckHomeworkModule',
        data: {moduleName: 'homework'},
    },

    {
        path: 'settings',
        loadChildren: 'app/modules/homework/pages/settings/settings.module#SettingsModule',
        data: {moduleName: 'homework'},
    },

    {
        path: '',   
        component: HomeworkComponent,
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
export class HomeworkRoutingModule { }
