import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageEventComponent } from '@modules/event-gallery/pages/manage-event/manage-event.component';

const routes: Routes = [
    {
        path: '',
        component: ManageEventComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageEventRoutingModule {}
