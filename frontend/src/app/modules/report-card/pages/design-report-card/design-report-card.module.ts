import { NgModule } from '@angular/core';


import { DesignReportCardRoutingModule } from './design-report-card.routing';
import {ComponentsModule} from '../../../../components/components.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { ColorPickerModule } from 'ngx-color-picker';


import {DesignReportCardComponent} from './design-report-card.component';


@NgModule({
    declarations: [
        DesignReportCardComponent
    ],

    imports: [
        DesignReportCardRoutingModule ,
        ComponentsModule,

        MatButtonToggleModule,
        MatIconModule,
        ColorPickerModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
