import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { AccountsComponent } from './accounts.component';

import { AccountsRoutingModule } from './accounts.routing';


@NgModule({
    declarations: [
        AccountsComponent,
    ],

    imports: [
        ComponentsModule,
        AccountsRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AccountsComponent]
})
export class AccountsModule { }
