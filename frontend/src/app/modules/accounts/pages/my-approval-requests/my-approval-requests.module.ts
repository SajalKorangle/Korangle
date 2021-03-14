import { NgModule } from '@angular/core';

import { MyApprovalRequestsComponent } from "./my-approval-requests.component";

import {MyApprovalRequestsRoutingModule } from './my-approval-requests.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { UseFortransactionDialogComponent } from './components/use-for-transaction-dialog/use-for-transaction-dialog.component';
import { NewApprovalDialogComponent } from './components/new-approval-dialog/new-approval-dialog.component'


@NgModule({
    declarations: [
        MyApprovalRequestsComponent,
        UseFortransactionDialogComponent,
        NewApprovalDialogComponent,
    ],

    imports: [
        MyApprovalRequestsRoutingModule,
        ComponentsModule,
    ],
    providers: [],
    
    bootstrap: [MyApprovalRequestsComponent],
    entryComponents: [
        UseFortransactionDialogComponent,
        NewApprovalDialogComponent,
    ]
    
})
export class MyApprovalRequestsModule { }
