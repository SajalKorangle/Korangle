import { NgModule } from '@angular/core';

import { AddAccountComponent } from "./add-account.component";
import { AddAccountRouting } from "./add-account.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        AddAccountComponent,
    ],
    imports: [
        AddAccountRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ AddAccountComponent ]
})
export class AddAccountModule { }
