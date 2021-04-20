import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SendSmsComponent } from './send-sms.component';

const routes: Routes = [
    {
        path: '',
        component: SendSmsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SendSmsRoutingModule {}
