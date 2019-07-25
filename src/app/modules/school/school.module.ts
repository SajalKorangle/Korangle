import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { SchoolComponent } from './school.component';

import { SchoolRoutingModule } from './school.routing';


@NgModule({
    declarations: [

        SchoolComponent,

    ],

    imports: [

        SchoolRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [SchoolComponent]
})
export class SchoolModule { }
