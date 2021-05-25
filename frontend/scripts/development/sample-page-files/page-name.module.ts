import { NgModule } from '@angular/core';

import { PageNameComponent } from "./page-name.component";
import { PageNameRouting } from "./page-name.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        PageNameComponent,
    ],
    imports: [
        PageNameRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ PageNameComponent ]
})
export class PageNameModule { }
