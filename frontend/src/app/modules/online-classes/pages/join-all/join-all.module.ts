import { NgModule } from '@angular/core';

import { JoinAllComponent } from "./join-all.component";
import { JoinAllRouting } from "./join-all.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        JoinAllComponent,
    ],
    imports: [
        JoinAllRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ JoinAllComponent ]
})
export class JoinAllModule { }
