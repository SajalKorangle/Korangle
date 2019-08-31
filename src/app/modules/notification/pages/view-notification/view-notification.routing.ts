import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {ViewNotificationComponent} from "./view-notification.component";

const routes: Routes = [
    {
        path: '',
        component: ViewNotificationComponent ,
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
export class ViewNotificationRoutingModule { }
