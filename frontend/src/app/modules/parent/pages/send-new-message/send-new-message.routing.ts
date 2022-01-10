import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SendNewMessageComponent } from "./send-new-message.component";

const routes: Routes = [
    {
        path: '',
        component: SendNewMessageComponent ,
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
export class SendNewMessageRouting { }
