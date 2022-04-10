import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AddStatusModalComponent } from './add-status-modal/add-status-modal.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { AddEditComplaintTypeComponent } from './add-edit-complaint-type/add-edit-complaint-type.component';

@NgModule({
    declarations: [AddStatusModalComponent, ShowTableComponent, AddEditComplaintTypeComponent],
    imports: [ComponentsModule],
    exports: [AddStatusModalComponent, ShowTableComponent, AddEditComplaintTypeComponent],
})
export class LocalComponentsModule { }
