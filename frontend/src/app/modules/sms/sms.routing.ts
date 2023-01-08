import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SmsComponent } from './sms.component';

const routes: Routes = [
    {
        path: 'send_sms',
        loadChildren: 'app/modules/sms/pages/send-sms/send-sms.module#SendSmsModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'view_sent',
        loadChildren: 'app/modules/sms/pages/view-sent/view-sent.module#ViewSentModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'view_purchases',
        loadChildren: 'app/modules/sms/pages/view-purchases/view-purchases.module#ViewPurchasesModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'manage_sms_id',
        loadChildren: 'app/modules/sms/pages/manage-sms-id/manage-sms-id.module#ManageSmsIdModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'manage_templates',
        loadChildren: 'app/modules/sms/pages/manage-templates/manage-templates.module#ManageTemplatesModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'purchase_sms',
        loadChildren: 'app/modules/sms/pages/purchase-sms/purchase-sms.module#PurchaseSmsModule',
        data: { moduleName: 'sms' },
    },
    {
        path: 'purchase_sms_2',
        loadChildren: 'app/modules/sms/pages/purchase-sms-2/purchase-sms.module#PurchaseSmsModule',
        data: { moduleName: 'sms' },
    },
    {
        path: '',
        component: SmsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SmsRoutingModule { }
