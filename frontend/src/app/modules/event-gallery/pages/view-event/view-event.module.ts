import { NgModule } from '@angular/core';
import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';
import {ViewEventRoutingModule} from '@modules/event-gallery/pages/view-event/view-event.routing';



@NgModule({
  declarations: [ViewEventComponent],
  imports: [
      ViewEventRoutingModule
  ],
   bootstrap: [ViewEventComponent]
})

export class ViewEventModule { }
