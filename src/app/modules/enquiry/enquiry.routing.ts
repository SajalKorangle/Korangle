import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EnquiryComponent } from './enquiry.component';
import {PRINT_ENQUIRY_LIST} from "../../print/print-routes.constants";
import {PrintEnquiryListComponent} from "./print/print-enquiry-list/print-enquiry-list.component";

const routes: Routes = [
    {
        path: '',
        component: EnquiryComponent,
    },
    {
        path: PRINT_ENQUIRY_LIST,
        component: PrintEnquiryListComponent,
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
