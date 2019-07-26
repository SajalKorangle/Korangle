import { NgModule } from '@angular/core';


import {GeneratePayslipRoutingModule} from './generate-payslip.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GeneratePayslipComponent} from "./generate-payslip.component";


@NgModule({
    declarations: [
        GeneratePayslipComponent
    ],

    imports: [
        GeneratePayslipRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GeneratePayslipComponent]
})
export class GeneratePayslipModule { }
