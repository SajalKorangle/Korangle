import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { HomeworkComponent } from './homework.component';

import { HomeworkRoutingModule } from './homework.routing';


@NgModule({
    declarations: [
        HomeworkComponent,
    ],

    imports: [
        ComponentsModule,
        HomeworkRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [HomeworkComponent]
})
export class HomeworkModule { }
