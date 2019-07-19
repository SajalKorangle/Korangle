import { NgModule } from '@angular/core';

import { GivePermissionsComponent } from "./give-permissions.component";

import {GivePermissionsRoutingModule } from './give-permission.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        GivePermissionsComponent
    ],

    imports: [
        GivePermissionsRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GivePermissionsComponent]
})
export class GivePermissionModule { }
