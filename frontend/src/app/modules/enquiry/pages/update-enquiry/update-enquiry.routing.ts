import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateEnquiryComponent } from './update-enquiry.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateEnquiryComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UpdateEnquiryRoutingModule {}
