import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from '@modules/event-gallery/pages/add-event/add-event.component';

const routes: Routes = [
    {
        path: '',
        component: AddEventComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddEventRoutingModule {}
