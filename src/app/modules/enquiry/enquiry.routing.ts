import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {PRINT_ENQUIRY_LIST} from "../../print/print-routes.constants";
import {PrintEnquiryListComponent} from "./print/print-enquiry-list/print-enquiry-list.component";

const routes: Routes = [
    {
        path: 'add_enquiry',
        loadChildren: 'app/modules/enquiry/pages/add-enquiry/add-enquiry.module#AddEnquiryModule',
        data: {moduleName: 'enquiries'},
    },
    {
        path: 'update_enquiry',
        loadChildren: 'app/modules/enquiry/pages/update-enquiry/update-enquiry.module#UpdateEnquiryModule',
        data: {moduleName: 'enquiries'},
    },
    {
        path: 'view_all',
        loadChildren: 'app/modules/enquiry/pages/view-all/view-all.module#ViewAllModule',
        data: {moduleName: 'enquiries'},
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
