import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'students',
        loadChildren: 'app/modules/students/student.module#StudentModule',
    },
    {
        path: 'school',
        loadChildren: 'app/modules/school/school.module#SchoolModule',
    },
    {
        path: 'marksheet',
        loadChildren: 'app/modules/marksheet/marksheet.module#MarksheetModule',
    },
    {
        path: 'expenses',
        loadChildren: 'app/modules/expenses/expense.module#ExpenseModule',
    },
    {
        path: 'fees',
        loadChildren: 'app/modules/fees-second/fee.module#FeeModule',
    },
    {
        path: 'team',
        loadChildren: 'app/modules/team/team.module#TeamModule',
    },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
      CommonModule,
      RouterModule,
  ],
})
export class AppRoutingModule { }
