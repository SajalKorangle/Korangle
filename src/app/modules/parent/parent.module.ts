import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ParentComponent } from './parent.component';

import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ViewFeeComponent } from './view-fee/view-fee.component';

import { ParentRoutingModule } from './parent.routing';

import { ParentService } from './parent.service';

@NgModule({
    declarations: [

        ParentComponent,
        ViewProfileComponent,
        ViewFeeComponent,

    ],

    imports: [

        ComponentsModule,
        ParentRoutingModule,

    ],
    exports: [
    ],
    providers: [ParentService],
    bootstrap: [ParentComponent],
})
export class ParentModule { }
