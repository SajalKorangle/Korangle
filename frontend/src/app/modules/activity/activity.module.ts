import { NgModule } from '@angular/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../components/components.module';

import { ActivityComponent } from './activity.component';

import { ActivityRoutingModule } from './activity.routing';

@NgModule({
    declarations: [
        ActivityComponent,
    ],

    imports: [ComponentsModule, ActivityRoutingModule, NgxDatatableModule],
    bootstrap: [ActivityComponent],
})
export class ActivityModule { }
