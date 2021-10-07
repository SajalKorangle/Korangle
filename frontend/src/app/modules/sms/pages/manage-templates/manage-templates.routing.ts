import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ManageTemplatesComponent} from '@modules/sms/pages/manage-templates/manage-templates.component';


const routes: Routes = [
    {
        path: '',
        component: ManageTemplatesComponent ,
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
export class ManageTemplatesRouting { }
