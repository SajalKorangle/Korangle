import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {GenerateReportCardRoutingModule} from './generate-report-card.routing';
import {ComponentsModule} from '../../../../components/components.module';
import {GenerateReportCardComponent} from './generate-report-card.component';


@NgModule({
    declarations: [
        GenerateReportCardComponent
    ],

    imports: [
        GenerateReportCardRoutingModule ,
        ComponentsModule,
        NgxDatatableModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateReportCardComponent]
})
export class GenerateReportCardModule { }
