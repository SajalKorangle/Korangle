import { NgModule } from '@angular/core';
import {ManageEventComponent} from '@modules/event-gallery/pages/manage-event/manage-event.component';
import {ManageEventRoutingModule} from '@modules/event-gallery/pages/manage-event/manage-event.routing';



@NgModule({
  declarations: [ManageEventComponent],
  imports: [
      ManageEventRoutingModule
  ],
   bootstrap: [ManageEventComponent]
})

export class ManageEventModule { }
