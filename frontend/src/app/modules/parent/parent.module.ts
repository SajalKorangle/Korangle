import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';

@NgModule({
    declarations: [ParentComponent],

    imports: [ComponentsModule, ParentRoutingModule],
    exports: [],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
