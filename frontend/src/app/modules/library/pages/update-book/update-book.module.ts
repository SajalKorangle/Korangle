import { NgModule } from '@angular/core';

import { UpdateBookRoutingModule } from './update-book.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { UpdateBookComponent } from "./update-book.component";

@NgModule({
    declarations: [UpdateBookComponent],

    imports: [UpdateBookRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [UpdateBookComponent],
})
export class UpdateBookModule { }
