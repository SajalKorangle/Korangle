import { NgModule } from '@angular/core';

import { ManageDefaultersTemplateComponent } from "./manage-defaulters-template.component";
import { ManageDefaultersTemplateRouting } from "./manage-defaulters-template.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        ManageDefaultersTemplateComponent,
    ],
    imports: [
        ManageDefaultersTemplateRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ ManageDefaultersTemplateComponent ]
})
export class ManageDefaultersTemplateModule { }
