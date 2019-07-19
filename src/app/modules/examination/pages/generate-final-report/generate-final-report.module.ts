import { NgModule } from '@angular/core';


import {GenerateFinalReporttRoutingModule} from './generate-final-report.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GenerateFinalReportComponent} from "./generate-final-report.component";


@NgModule({
    declarations: [
        GenerateFinalReportComponent
    ],

    imports: [
        GenerateFinalReporttRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateFinalReportComponent]
})
export class GenerateFinalReportModule { }
