import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineClassesComponent } from './online-classes.component';

const routes: Routes = [
  {
    path: '',
    component: OnlineClassesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineClassesRoutingModule { }
