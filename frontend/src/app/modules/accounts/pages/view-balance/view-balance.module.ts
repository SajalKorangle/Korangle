import { NgModule } from '@angular/core';

import { ViewBalanceComponent } from "./view-balance.component";

import {ViewBalanceRoutingModule } from './view-balance.routing';
import {ComponentsModule} from "../../../../components/components.module";
import { AccountsComponentsModule } from './../../components/component.module'


@NgModule({
    declarations: [
        ViewBalanceComponent,
    ],

    imports: [
        ViewBalanceRoutingModule,
        ComponentsModule,
        AccountsComponentsModule,
    ],
    providers: [],
    
    bootstrap: [ViewBalanceComponent],
})
export class ViewBalanceModule { }
