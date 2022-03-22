import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { FormatTableModalComponent } from './format-table-modal/format-table-modal.component';
import { ShowComplaintListModalComponent } from './show-complaint-list-modal/show-complaint-list-modal.component';

@NgModule({
    declarations: [FilterModalComponent, FormatTableModalComponent, ShowComplaintListModalComponent],
    imports: [ComponentsModule],
    exports: [FilterModalComponent, FormatTableModalComponent, ShowComplaintListModalComponent],
})
export class LocalComponentsModule { }
