import { NgModule } from '@angular/core';

import { ViewReportComponent } from "./view-report.component";

import {ViewReportRoutingModule } from './view-report.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        ViewReportComponent
    ],

    imports: [
        ViewReportRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewReportComponent]
})
export class ViewReportModule { }
