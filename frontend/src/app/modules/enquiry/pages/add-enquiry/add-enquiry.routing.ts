import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddEnquiryComponent } from './add-enquiry.component';

const routes: Routes = [
    {
        path: '',
        component: AddEnquiryComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddEnquiryRoutingModule {}
