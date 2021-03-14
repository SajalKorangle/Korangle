import { NgModule } from '@angular/core';

import { MyApprovalRequestsComponent } from "./my-approval-requests.component";

import {MyApprovalRequestsRoutingModule } from './my-approval-requests.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { UseFortransactionDialogComponent } from './components/use-for-transaction-dialog/use-for-transaction-dialog.component';


@NgModule({
    declarations: [
        MyApprovalRequestsComponent,
        UseFortransactionDialogComponent,
    ],

    imports: [
        MyApprovalRequestsRoutingModule,
        ComponentsModule,
    ],
    providers: [],
    
    bootstrap: [MyApprovalRequestsComponent],
    entryComponents: [
        UseFortransactionDialogComponent,
    ]
    
})
export class MyApprovalRequestsModule { }
