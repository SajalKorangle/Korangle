import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { MarksheetComponent } from './marksheet.component';

import { UpdateMarksComponent } from './update-marks/update-marks.component';
import { ViewMarksheetComponent } from './view-marksheet/view-marksheet.component';

import { MarksheetRoutingModule } from './marksheet.routing';
import { PrintMarksheetComponent } from './print/print-marksheet/print-marksheet.component';
import { PrintMarksheetSecondFormatComponent } from './print/print-marksheet-second-format/print-marksheet-second-format.component';

@NgModule({
    declarations: [

        MarksheetComponent,

        // UpdateMarksComponent,
        // ViewMarksheetComponent,

        PrintMarksheetComponent,
        PrintMarksheetSecondFormatComponent

    ],

    imports: [

        MarksheetRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [MarksheetComponent]
})
export class MarksheetModule { }
