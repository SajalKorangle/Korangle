import { NgModule } from '@angular/core';


import { UpdateProfileRoutingModule} from './update-profile.routing';
import {ComponentsModule} from "../../../../components/components.module";
import {UpdateProfileComponent} from "./update-profile.component";

import {MultipleFileDialogModule} from '../../../../components/multiple-file-dialog/multiple-file-dialog.module';

@NgModule({
    declarations: [
        UpdateProfileComponent
    ],

    imports: [
        UpdateProfileRoutingModule ,
        ComponentsModule,
        MultipleFileDialogModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [UpdateProfileComponent]
})
export class UpdateProfileModule { }
