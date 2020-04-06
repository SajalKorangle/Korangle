import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../components/components.module';

import { CustomReportCardComponent } from './custom_reportcard.component';

import { CustomReportCardRoutingModule } from './custom_reportcard.routing';
import { PrintCustomReportCardComponent } from './print/print-custom_reportcard/print-custom_reportcard.component';


@NgModule({
    declarations: [
        PrintCustomReportCardComponent,
        CustomReportCardComponent,
    ],

    imports: [
        ComponentsModule,
        CustomReportCardRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [CustomReportCardComponent],
})
export class CustomReportCardModule { }
