import { NgModule } from '@angular/core';
import {ManageEventComponent} from '@modules/event-gallery/pages/manage-event/manage-event.component';
import {ManageEventRoutingModule} from '@modules/event-gallery/pages/manage-event/manage-event.routing';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentsModule} from '@components/components.module';
import {ImagePreviewDialogComponent} from '@components/modal/image-preview-dialog.component';



@NgModule({
  declarations: [ManageEventComponent],
    imports: [
        ManageEventRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
   bootstrap: [ManageEventComponent],
   entryComponents: [ImagePreviewDialogComponent]
})

export class ManageEventModule { }
