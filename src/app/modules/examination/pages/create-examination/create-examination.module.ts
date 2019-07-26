import { NgModule } from '@angular/core';


import {CreateExaminationtRoutingModule} from './create-examination.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {CreateExaminationComponent} from "./create-examination.component";


@NgModule({
    declarations: [
        CreateExaminationComponent
    ],

    imports: [
        CreateExaminationtRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [CreateExaminationComponent]
})
export class CreateExaminationModule { }
