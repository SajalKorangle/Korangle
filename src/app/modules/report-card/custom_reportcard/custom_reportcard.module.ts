import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../components/components.module';

import { CustomReportCardComponent } from './custom_reportcard.component';

import { CustomReportCardRoutingModule } from './custom_reportcard.routing';


@NgModule({
    declarations: [

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
