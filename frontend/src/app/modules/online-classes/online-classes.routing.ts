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
    loadChildren: 'app/modules/online-classes/pages/teach-class/teach-class.module#TeachClassModule',
    data: { moduleName: 'online_classes' },
  },
  {
    path: 'add_account',
    loadChildren: 'app/modules/online-classes/pages/add-account/add-account.module#AddAccountModule',
    data: { moduleName: 'online_classes' },
  },
  {
    path: 'student_permission',
    loadChildren: 'app/modules/online-classes/pages/student-permission/student-permission.module#StudentPermissionModule',
    data: { moduleName: 'online_classes' },
  },
  {
    path: 'attendance_report',
    loadChildren: 'app/modules/online-classes/pages/attendance-report/attendance-report.module#AttendanceReportModule',
    data: { moduleName: 'online_classes' },
  },
  {
    path: 'join_all',
    loadChildren: 'app/modules/online-classes/pages/join-all/join-all.module#JoinAllModule',
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
