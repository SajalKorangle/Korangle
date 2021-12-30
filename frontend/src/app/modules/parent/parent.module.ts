import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';

import {PrintComponentsModule} from '@modules/fees/print/print-components.module';

@NgModule({
    declarations: [ParentComponent],

    imports: [ComponentsModule, ParentRoutingModule, PrintComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
