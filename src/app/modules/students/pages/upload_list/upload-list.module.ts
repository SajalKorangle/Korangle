import { NgModule } from '@angular/core';


import { UploadListRoutingModule} from './upload-list.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {UploadListComponent} from "./upload-list.component";


@NgModule({
    declarations: [
        UploadListComponent
    ],

    imports: [
        UploadListRoutingModule ,
        ComponentsModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UploadListComponent]
})
export class UploadListModule { }
