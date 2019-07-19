import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { SchoolComponent } from './school.component';

import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';

import { SchoolRoutingModule } from './school.routing';


@NgModule({
    declarations: [

        SchoolComponent,
        // UpdateProfileComponent,

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
