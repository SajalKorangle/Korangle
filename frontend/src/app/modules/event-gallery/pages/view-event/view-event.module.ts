import { NgModule } from '@angular/core';
import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';
import {ViewEventRoutingModule} from '@modules/event-gallery/pages/view-event/view-event.routing';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentsModule} from '@components/components.module';
import {EventImageModalComponent} from '@modules/event-gallery/components/event-image-modal/event-image-modal.component';



@NgModule({
  declarations: [ViewEventComponent],
  imports: [
      ViewEventRoutingModule,
      ReactiveFormsModule,
      ComponentsModule
  ],
   bootstrap: [ViewEventComponent], 
   entryComponents: [EventImageModalComponent]

})

export class ViewEventModule { }
