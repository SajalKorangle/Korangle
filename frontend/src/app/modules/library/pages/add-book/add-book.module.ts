import { NgModule } from '@angular/core';

import { AddBookComponent } from "./add-book.component";
import { AddBookRouting } from "./add-book.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        AddBookComponent,
    ],
    imports: [
        AddBookRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ AddBookComponent ]
})
export class AddBookModule { }
