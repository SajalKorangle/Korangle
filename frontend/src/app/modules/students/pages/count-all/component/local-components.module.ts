import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { FormatTableModalComponent } from './format-table-modal/format-table-modal.component';
import { ShowStudentListModalComponent } from './show-student-list-modal/show-student-list-modal.component';
import { DeleteTableModalComponent } from './delete-table-modal/delete-table-modal.component';

@NgModule({
    declarations: [FilterModalComponent, FormatTableModalComponent, ShowStudentListModalComponent, DeleteTableModalComponent],
    imports: [ComponentsModule],
    exports: [FilterModalComponent, FormatTableModalComponent, ShowStudentListModalComponent, DeleteTableModalComponent],
})
export class LocalComponentsModule { }
