import { NgModule } from '@angular/core';


import {SetFinalReportRoutingModule} from './set-final-report.routing';
import {ComponentsModule} from "../../../../../components/components.module";
import {SetFinalReportComponent} from "./set-final-report.component";


@NgModule({
    declarations: [
        SetFinalReportComponent
    ],

    imports: [
        SetFinalReportRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SetFinalReportComponent]
})
export class SetFinalReportModule { }
