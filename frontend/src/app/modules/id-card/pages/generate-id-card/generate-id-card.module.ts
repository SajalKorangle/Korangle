import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {GenerateIdCardRoutingModule} from './generate-id-card.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {GenerateIdCardComponent} from "./generate-id-card.component";


@NgModule({
    declarations: [
        GenerateIdCardComponent
    ],

    imports: [
        GenerateIdCardRoutingModule ,
        ComponentsModule,
        NgxDatatableModule
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [GenerateIdCardComponent]
})
export class GenerateIdCardModule { }