import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';
import { FeesComponentsModule } from '../fees/components/fees-components.module';
import { FeeModule } from '@modules/fees/fee.module';
@NgModule({
    declarations: [ParentComponent],

    imports: [ComponentsModule, FeesComponentsModule, ParentRoutingModule, FeeModule],
    exports: [],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
