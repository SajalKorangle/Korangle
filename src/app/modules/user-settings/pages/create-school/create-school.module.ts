import { NgModule } from '@angular/core';


import {CreateSchoolRoutingModule} from './create-school.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CreateSchoolComponent} from "./create-school.component";


@NgModule({
    declarations: [
        CreateSchoolComponent
    ],

    imports: [
        CreateSchoolRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CreateSchoolComponent]
})
export class CreateSchoolModule { }
