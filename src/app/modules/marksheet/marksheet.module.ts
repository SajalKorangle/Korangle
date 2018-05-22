import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { MarksheetComponent } from './marksheet.component';

import { UpdateMarksComponent } from './update-marks/update-marks.component';
import { ViewMarksheetComponent } from './view-marksheet/view-marksheet.component';

import { MarksheetRoutingModule } from './marksheet.routing';

@NgModule({
    declarations: [

        MarksheetComponent,

        UpdateMarksComponent,
        ViewMarksheetComponent,

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
