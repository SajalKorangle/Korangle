import { NgModule } from '@angular/core';

import { CountAllRoutingModule } from './count-all.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { CountAllComponent } from './count-all.component';
import { LocalComponentsModule } from '@modules/students/component/local-components.module';
import { FilterModalComponent } from '@modules/students/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/students/component/format-table-modal/format-table-modal.component';

@NgModule({
    declarations: [CountAllComponent],
    imports: [
        CountAllRoutingModule,
        ComponentsModule,
        LocalComponentsModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [CountAllComponent],
    entryComponents: [FilterModalComponent, FormatTableModalComponent],
})
export class CountAllModule {}
