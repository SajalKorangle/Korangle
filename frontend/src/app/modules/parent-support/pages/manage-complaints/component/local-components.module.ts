import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { ListComplaintsComponent } from './list-complaints/list-complaints.component';
import { OpenComplaintComponent } from './open-complaint/open-complaint.component';

@NgModule({
    declarations: [
        AssignEmployeeComponent,
        ListComplaintsComponent,
        OpenComplaintComponent,
    ],
    imports: [ComponentsModule],
    exports: [
        AssignEmployeeComponent,
        ListComplaintsComponent,
        OpenComplaintComponent,
    ],
})
export class LocalComponentsModule { }
