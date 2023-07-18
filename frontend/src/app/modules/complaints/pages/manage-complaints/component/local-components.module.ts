import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AssignEmployeeModalComponent } from './assign-employee-modal/assign-employee-modal.component';
import { ListComplaintsComponent } from './list-complaints/list-complaints.component';
import { OpenComplaintComponent } from './open-complaint/open-complaint.component';

@NgModule({
    declarations: [
        AssignEmployeeModalComponent,
        ListComplaintsComponent,
        OpenComplaintComponent,
    ],
    imports: [ComponentsModule],
    exports: [
        AssignEmployeeModalComponent,
        ListComplaintsComponent,
        OpenComplaintComponent,
    ],
})
export class LocalComponentsModule { }
