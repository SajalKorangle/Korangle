import { NgModule } from '@angular/core';

import { AddViaExcelComponent } from "./add-via-excel.component";
import { AddViaExcelRouting } from "./add-via-excel.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        AddViaExcelComponent,
    ],
    imports: [
        AddViaExcelRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ AddViaExcelComponent ]
})
export class AddViaExcelModule { }
