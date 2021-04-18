import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventGalleryComponent } from '@modules/event-gallery/event-gallery.component';

const routes: Routes = [
    {
        path: 'add_event',
        loadChildren: 'app/modules/event-gallery/pages/add-event/add-event.module#AddEventModule',
        data: { moduleName: 'event_gallery' },
    },
    {
        path: 'manage_event',
        loadChildren: 'app/modules/event-gallery/pages/manage-event/manage-event.module#ManageEventModule',
        data: { moduleName: 'event_gallery' },
    },
    {
        path: 'view_event',
        loadChildren: 'app/modules/event-gallery/pages/view-event/view-event.module#ViewEventModule',
        data: { moduleName: 'event_gallery' },
    },
    {
        path: '',
        component: EventGalleryComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EventGalleryRoutingModule {}
