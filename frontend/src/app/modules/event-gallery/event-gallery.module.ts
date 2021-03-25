import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventGalleryComponent} from '@modules/event-gallery/event-gallery.component';
import {EventGalleryRoutingModule} from '@modules/event-gallery/event-gallery.routing';



@NgModule({
  declarations: [EventGalleryComponent],
  imports: [
    CommonModule,
    EventGalleryRoutingModule
  ]
})
export class EventGalleryModule { }
