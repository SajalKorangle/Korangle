import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';


const routes: Routes = [ {
        path: '',
        component: ViewEventComponent ,
    }];

@NgModule({
  imports: [CommonModule,
      RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEventRoutingModule {}
