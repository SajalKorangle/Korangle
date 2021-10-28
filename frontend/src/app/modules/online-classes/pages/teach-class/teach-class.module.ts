import { NgModule } from '@angular/core';

import { TeachClassComponent } from "./teach-class.component";
import { TeachClassRouting } from "./teach-class.routing";
import { ComponentsModule } from "@components/components.module";

@NgModule({
    declarations: [
        TeachClassComponent,
    ],
    imports: [
        TeachClassRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [TeachClassComponent]
})
export class TeachClassModule { }
