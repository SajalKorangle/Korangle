import { NgModule } from '@angular/core';

import { CountAllRoutingModule } from './count-all.routing';
import { ComponentsModule } from "../../../../components/components.module";
import { CountAllComponent } from "./count-all.component";
import { LocalComponentsModule } from '@modules/parent-support/component/local-components.module';
import { LocalComponentsModule as LocalComponentsModulee } from '@modules/parent-support/pages/count-all/component/local-components.module';
import { FilterModalComponent } from '@modules/parent-support/pages/count-all/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/parent-support/pages/count-all/component/format-table-modal/format-table-modal.component';
import { ShowComplaintListModalComponent } from '@modules/parent-support/pages/count-all/component/show-complaint-list-modal/show-complaint-list-modal.component';
import { DeleteTableModalComponent } from '@modules/parent-support/component/delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [CountAllComponent],

    imports: [CountAllRoutingModule, ComponentsModule, LocalComponentsModule, LocalComponentsModulee],
    exports: [],
    providers: [],
    bootstrap: [CountAllComponent],
    entryComponents: [FilterModalComponent, FormatTableModalComponent, ShowComplaintListModalComponent, DeleteTableModalComponent],
})
export class CountAllModule { }
