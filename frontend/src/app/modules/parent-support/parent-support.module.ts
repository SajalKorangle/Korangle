import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { ParentSupportComponent } from './parent-support.component';
import { ParentSupportRoutingModule } from './parent-support.routing';

@NgModule({
    declarations: [
        ParentSupportComponent,
    ],

    imports: [ComponentsModule, ParentSupportRoutingModule],
    exports: [],
    entryComponents: [],
    providers: [],
    bootstrap: [ParentSupportComponent],
})
export class ParentSupportModule { }
