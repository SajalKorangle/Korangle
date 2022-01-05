import { NgModule } from '@angular/core';


import { ComponentsModule } from "../../../../components/components.module";
import { SetBankAccountComponent } from './set-bank-account.component';
import { FeesComponentsModule } from "../../components/fees-components.module";
import { SetBankAccountRoutingModule } from './set-bank.account.routing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        SetBankAccountComponent
    ],

    imports: [
        SetBankAccountRoutingModule,
        ComponentsModule,
        FeesComponentsModule,
        MatProgressSpinnerModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SetBankAccountComponent]
})
export class SetBankAccountModule { }
