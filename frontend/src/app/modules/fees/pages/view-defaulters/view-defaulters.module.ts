import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material'
import { ViewDefaultersRoutingModule } from './view-defaulters.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { ViewDefaultersComponent } from "./view-defaulters.component";
import { MatPaginatorModule} from '@angular/material';


@NgModule({
    declarations: [
        ViewDefaultersComponent
    ],

    imports: [
        ViewDefaultersRoutingModule,
        ComponentsModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [ViewDefaultersComponent]
})
export class ViewDefaultersModule { }