import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { OpenMessageComponent } from "./open-message.component";

const routes: Routes = [
    {
        path: '',
        component: OpenMessageComponent ,
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
export class OpenMessageRouting { }
