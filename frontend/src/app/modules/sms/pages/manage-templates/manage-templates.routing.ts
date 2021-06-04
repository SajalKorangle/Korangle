import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {SmsEventSettingsComponent} from '@modules/sms/pages/manage-templates/sms-event-settings.component';


const routes: Routes = [
    {
        path: '',
        component: SmsEventSettingsComponent ,
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
export class SmsEventSettingsRouting { }
