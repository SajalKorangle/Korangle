import { NgModule } from '@angular/core';

import { ManageAccountsComponent } from "./manage-accounts.component";
import { ManageAccountsRoutingModule } from "./manage-accounts.routing"
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
    declarations: [
        ManageAccountsComponent
    ],

    imports: [
        ManageAccountsRoutingModule,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ManageAccountsComponent]
})
export class ManageAccountsModule { } 