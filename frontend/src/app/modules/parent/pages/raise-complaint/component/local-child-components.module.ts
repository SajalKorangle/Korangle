import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { ListComplaintsComponent } from './list-complaints/list-complaints.component';
import { OpenComplaintComponent } from './open-complaint/open-complaint.component';
import { SendComplaintComponent } from './send-complaint/send-complaint.component';


@NgModule({
    declarations: [
        ListComplaintsComponent,
        OpenComplaintComponent,
        SendComplaintComponent,
    ],
    imports: [ComponentsModule],
    exports: [
        ListComplaintsComponent,
        OpenComplaintComponent,
        SendComplaintComponent,
    ],
})
export class LocalChildComponentsModule { }
