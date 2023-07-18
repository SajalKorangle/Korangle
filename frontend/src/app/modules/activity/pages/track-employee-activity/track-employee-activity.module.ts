import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../../components/components.module';

import { TrackEmployeeActivityRoutingModule } from './track-employee-activity.routing';
import { TrackEmployeeActivityComponent } from './track-employee-activity.component';

import { FilterModalComponent } from '@modules/activity/components/filter-modal/filter-modal.component';
import { LocalComponentsModule } from '@modules/activity/components/local-components.module';

@NgModule({
    declarations: [TrackEmployeeActivityComponent],

    imports: [
        TrackEmployeeActivityRoutingModule,
        ComponentsModule,
        LocalComponentsModule,
      ],
    exports: [],
    providers: [],
    bootstrap: [TrackEmployeeActivityComponent],
    entryComponents: [FilterModalComponent],
})
export class TrackEmployeeActivityModule {}
