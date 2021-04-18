import { NgModule } from '@angular/core';
import { AddEventComponent } from '@modules/event-gallery/pages/add-event/add-event.component';
import { AddEventRoutingModule } from '@modules/event-gallery/pages/add-event/add-event.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';

@NgModule({
    declarations: [AddEventComponent],
    imports: [AddEventRoutingModule, ReactiveFormsModule, ComponentsModule],
    bootstrap: [AddEventComponent],
})
export class AddEventModule {}
