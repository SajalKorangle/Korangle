import { NgModule } from '@angular/core';
import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';
import {ViewEventRoutingModule} from '@modules/event-gallery/pages/view-event/view-event.routing';
import {ReactiveFormsModule} from '@angular/forms';
import {ComponentsModule} from '@components/components.module';



@NgModule({
  declarations: [ViewEventComponent],
  imports: [
      ViewEventRoutingModule,
      ReactiveFormsModule,
      ComponentsModule
  ],
   bootstrap: [ViewEventComponent]
})

export class ViewEventModule { }
