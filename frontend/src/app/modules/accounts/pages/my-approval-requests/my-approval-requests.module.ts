import { NgModule } from '@angular/core';

import { MyApprovalRequestsComponent } from "./my-approval-requests.component";

import {MyApprovalRequestsRoutingModule } from './my-approval-requests.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        MyApprovalRequestsComponent
    ],

    imports: [
        MyApprovalRequestsRoutingModule,
        ComponentsModule,
    ],
    providers: [],
    
    bootstrap: [MyApprovalRequestsComponent],
    
})
export class MyApprovalRequestsModule { }
