import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AddStatusModalComponent } from './add-status-modal/add-status-modal.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { AddComplaintTypeComponent } from './add-complaint-type/add-complaint-type.component';

@NgModule({
    declarations: [AddStatusModalComponent, ShowTableComponent, AddComplaintTypeComponent],
    imports: [ComponentsModule],
    exports: [AddStatusModalComponent, ShowTableComponent, AddComplaintTypeComponent],
})
export class LocalComponentsModule { }
