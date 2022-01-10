import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ParentComponent } from './parent.component';

import { PRINT_FULL_FEE_RECIEPT_LIST } from '@modules/fees/print/print-routes.constants';
import { PrintFullFeeReceiptListComponent } from '@modules/fees/print/print-full-fee-receipt-list/print-full-fee-receipt-list.component';

const routes: Routes = [
    {
        path: 'view_profile',
        loadChildren: 'app/modules/parent/pages/view-profile/view-profile.module#ViewProfileModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'pay_fees',
        loadChildren: 'app/modules/parent/pages/pay-fees/pay-fees.module#PayFeesModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'view_event',
        loadChildren: 'app/modules/event-gallery/pages/view-event/view-event.module#ViewEventModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'view_marks',
        loadChildren: 'app/modules/parent/pages/view-marks/view-marks.module#ViewMarksModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'view_attendance',
        loadChildren: 'app/modules/parent/pages/view-attendance/view-attendance.module#ViewAttendanceModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'view_tutorials',
        loadChildren: 'app/modules/parent/pages/view-tutorials/view-tutorials.module#ViewTutorialsModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'view_homework',
        loadChildren: 'app/modules/parent/pages/view-homework/view-homework.module#ViewHomeworkModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'join_class',
        loadChildren: 'app/modules/parent/pages/join-class/classroom.module#ClassroomModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'manage_my_complaints',
        loadChildren: 'app/modules/parent/pages/manage-my-complaints/manage-my-complaints.module#ManageMyComplaintsModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'send_new_message',
        loadChildren: 'app/modules/parent/pages/send-new-message/send-new-message.module#SendNewMessageModule',
        data: { moduleName: 'parent' },
    },
    {
        path: 'open_message',
        loadChildren: 'app/modules/parent/pages/open-message/open-message.module#OpenMessageModule',
        data: { moduleName: 'parent' },
    },
    {
        path: '',
        component: ParentComponent,
    },
    {
        path: PRINT_FULL_FEE_RECIEPT_LIST,
        component: PrintFullFeeReceiptListComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParentRoutingModule { }
