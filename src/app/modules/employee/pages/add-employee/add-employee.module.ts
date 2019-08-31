import { NgModule } from '@angular/core';

import { AddEmployeeComponent } from "./add-employee.component";

import {AddEmployeeRoutingModule  } from './add-employee.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
    declarations: [
        AddEmployeeComponent
    ],

    imports: [
        AddEmployeeRoutingModule  ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AddEmployeeComponent]
})
export class AddEmployeeModule { }
