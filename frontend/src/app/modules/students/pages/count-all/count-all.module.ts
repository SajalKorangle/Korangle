import { NgModule } from '@angular/core';

import { CountAllRoutingModule } from './count-all.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { CountAllComponent } from './count-all.component';
import { LocalComponentsModule } from '@modules/students/pages/count-all/component/local-components.module';
import { FilterModalComponent } from '@modules/students/pages/count-all/component/filter-modal/filter-modal.component';
import { FormatTableModalComponent } from '@modules/students/pages/count-all/component/format-table-modal/format-table-modal.component';
import { ShowStudentListModalComponent } from '@modules/students/pages/count-all/component/show-student-list-modal/show-student-list-modal.component';
import { DeleteTableModalComponent } from '@modules/students/pages/count-all/component/delete-table-modal/delete-table-modal.component';

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
    entryComponents: [FilterModalComponent, FormatTableModalComponent, ShowStudentListModalComponent, DeleteTableModalComponent],
})
export class CountAllModule {}
