import { NgModule } from '@angular/core';

import { GrantApprovalComponent } from "./grant-approval.component";

import {GrantApprovalRoutingModule } from './grant-approval.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        GrantApprovalComponent,
    ],

    imports: [
        GrantApprovalRoutingModule,
        ComponentsModule,
    ],
    providers: [],

    bootstrap: [GrantApprovalComponent],
})
export class GrantApprovalModule { }
