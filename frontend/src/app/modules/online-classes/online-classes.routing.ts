import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineClassesComponent } from './online-classes.component';

const routes: Routes = [
  {
    path: 'settings',
    loadChildren: 'app/modules/online-classes/pages/settings/settings.module#SettingsModule',
    data: { moduleName: 'online_classes' },
  },
  {
    path: 'join_class',
    loadChildren: 'app/modules/online-classes/pages/classroom/classroom.module#ClassroomModule',
    data: { moduleName: 'online_classes' },
  },
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
