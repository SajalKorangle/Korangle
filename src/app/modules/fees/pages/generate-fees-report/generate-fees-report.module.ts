import { NgModule } from '@angular/core';


import {GenerateFeesReportRoutingModule} from './generate-fees-report.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GenerateFeesReportComponent} from "./generate-fees-report.component";


@NgModule({
    declarations: [
        GenerateFeesReportComponent
    ],

    imports: [
        GenerateFeesReportRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateFeesReportComponent]
})
export class GenerateFeesReportModule { }
