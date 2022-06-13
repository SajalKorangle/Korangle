import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { TableNameModalComponent } from './table-name-modal/table-name-modal.component';
import { ShowComplaintListModalComponent } from './show-complaint-list-modal/show-complaint-list-modal.component';

@NgModule({
    declarations: [FilterModalComponent, TableNameModalComponent, ShowComplaintListModalComponent],
    imports: [ComponentsModule],
    exports: [FilterModalComponent, TableNameModalComponent, ShowComplaintListModalComponent],
})
export class LocalComponentsModule { }
