import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DeleteEnquiryComponent } from './delete-enquiry.component';

const routes: Routes = [
    {
        path: '',
        component: DeleteEnquiryComponent,
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
export class DeleteEnquiryRoutingModule { }
