import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EnquiryComponent } from './enquiry.component';

const routes: Routes = [
    {
        path: '',
        component: EnquiryComponent,
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
export class EnquiryRoutingModule { }
