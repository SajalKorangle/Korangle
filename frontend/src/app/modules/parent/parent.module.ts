import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';

import {FeePrintModule} from '@modules/fees/print/print-components.module';

@NgModule({
    declarations: [ParentComponent],

    imports: [ComponentsModule, ParentRoutingModule, FeePrintModule],
    exports: [],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
