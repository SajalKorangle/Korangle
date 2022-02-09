import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { ActivityComponent } from './activity.component';

import { ActivityRoutingModule } from './activity.routing';

@NgModule({
    declarations: [
        ActivityComponent,
    ],

    imports: [ComponentsModule, ActivityRoutingModule],
    bootstrap: [ActivityComponent],
})
export class ActivityModule { }
