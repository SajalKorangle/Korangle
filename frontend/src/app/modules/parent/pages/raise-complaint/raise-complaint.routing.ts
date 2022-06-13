import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RaiseComplaintComponent } from "./raise-complaint.component";

const routes: Routes = [
    {
        path: '',
        component: RaiseComplaintComponent ,
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
export class RaiseComplaintRouting { }
