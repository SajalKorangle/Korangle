import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AddEditStatusModalComponent } from './add-edit-status-modal/add-edit-status-modal.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { AddEditComplaintTypeComponent } from './add-edit-complaint-type/add-edit-complaint-type.component';

@NgModule({
    declarations: [AddEditStatusModalComponent, ShowTableComponent, AddEditComplaintTypeComponent],
    imports: [ComponentsModule],
    exports: [AddEditStatusModalComponent, ShowTableComponent, AddEditComplaintTypeComponent],
})
export class LocalComponentsModule { }
