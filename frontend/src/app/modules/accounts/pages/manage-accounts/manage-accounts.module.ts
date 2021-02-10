import { NgModule } from '@angular/core';

import { ManageAccountsComponent } from "./manage-accounts.component";
import { ManageAccountsRoutingModule } from "./manage-accounts.routing"
import {ComponentsModule} from "../../../../components/components.module";
import { AddAccountDialogComponent } from './add-account-dialog/add-account-dialog.component'
import { EditAccountDialogComponent } from './edit-account-dialog/edit-account-dialog.component'   

@NgModule({
    declarations: [
        ManageAccountsComponent,
        AddAccountDialogComponent,
        EditAccountDialogComponent,
    ],

    imports: [
        ManageAccountsRoutingModule,
        ComponentsModule,
    ],
    exports: [
        AddAccountDialogComponent, 
        EditAccountDialogComponent
    ],
    providers: [],
    bootstrap: [ManageAccountsComponent],
    entryComponents: [ 
        AddAccountDialogComponent, 
        EditAccountDialogComponent,
    ]

})
export class ManageAccountsModule { } 