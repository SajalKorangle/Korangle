import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { FeesComponent } from './fees/fees.component';
/*import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { FeesReceiptsComponent } from './fees-receipts/fees-receipts.component';
import { StudentListComponent } from './student-list/student-list.component';*/
import { StudentComponent } from './students/students.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { LoginComponent } from './authentication/login.component';
import {ExpensesComponent} from './expenses/expenses.component';
import {ConcessionComponent} from './concession/concession.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'fees',      component: FeesComponent },
    { path: 'students', component: StudentComponent },
    { path: 'new_student', component: NewStudentComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'concession', component: ConcessionComponent },
    /*{ path: '',          redirectTo: 'students', pathMatch: 'full' },*/

    /*{ path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
		{ path: 'fees-receipts', component: FeesReceiptsComponent },
		{ path: 'student-list', component: StudentListComponent },*/
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
