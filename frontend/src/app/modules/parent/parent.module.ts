import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ParentRoutingModule } from './parent.routing';
import { FeesComponentsModule } from '../fees/components/fees-components.module';
import { FeeModule } from '@modules/fees/fee.module';
@NgModule({
    declarations: [ParentComponent],

    // Code Review
    // Importing Fees module in Parents Module
    // Will this kind of implementation lead to circular dependency in future?
    // We can move the Print Full Fee Receipt Component file in the modules/common folder.
    // We can directly import the component from there?
    imports: [ComponentsModule, FeesComponentsModule, ParentRoutingModule, FeeModule],
    exports: [],
    providers: [],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
