import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NotificationComponent } from './notification.component';

const routes: Routes = [
    {
        path: 'view_notification',
        loadChildren: 'app/modules/notification/pages/view-notification/view-notification.module#ViewNotificationModule',
        data: {moduleName: 'notification'},
    },
    {
        path: '',
        component: NotificationComponent,
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
export class NotificationRoutingModule { }
