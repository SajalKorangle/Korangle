import { NgModule } from '@angular/core';

import { DeleteBookComponent } from "./delete-book.component";
import { DeleteBookRouting } from "./delete-book.routing";
import {ComponentsModule} from "@components/components.module";

@NgModule({
    declarations: [
        DeleteBookComponent,
    ],
    imports: [
        DeleteBookRouting,
        ComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [ DeleteBookComponent ]
})
export class DeleteBookModule { }
