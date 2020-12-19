import { NgModule } from '@angular/core';


import { ViewHomeworkRoutingModule} from './view-homework.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {ViewHomeworkComponent} from "./view-homework.component";


@NgModule({
    declarations: [
        ViewHomeworkComponent
    ],

    imports: [
        ViewHomeworkRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewHomeworkComponent]
})
export class ViewHomeworkModule { }
