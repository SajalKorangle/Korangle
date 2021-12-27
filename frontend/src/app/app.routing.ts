import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreload } from './custom-preload';
import {ContactUsComponent} from './frontpage/contact-us/contact-us.component';
import {CreateSchoolComponent} from './frontpage/create-school/create-school.component';
import {LoginSignupComponent} from './frontpage/login-signup/login-signup.component';
import {ForgotPasswordComponent} from './frontpage/forgot-password/forgot-password.component';

const routes: Routes = [

    // ----- Routes For Outside The User DashBoard Starts -------
    {path: 'contact-us', component: ContactUsComponent},
    {path: 'create-school', component: CreateSchoolComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'sign-up', component: LoginSignupComponent},
    {path: 'login', component: LoginSignupComponent},
    // ----- Routes For Outside The User DashBoard Ends -------

    {
        path: 'dashboard',
        loadChildren: 'app/modules/dash-board.module#DashBoardModule'
    },

    // ----- Routes For Print Pages Starts -------
    {
        path: 'print',
        outlet: 'print',
        children: [
            { path: 'students', loadChildren: 'app/modules/students/student.module#StudentModule' },
            { path: 'fees', loadChildren: 'app/modules/fees/fee.module#FeeModule' },
            { path: 'attendance', loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule' },
            { path: 'employees', loadChildren: 'app/modules/employee/employee.module#EmployeeModule' },
            { path: 'examinations', loadChildren: 'app/modules/examination/examination.module#ExaminationModule' },
            {
                path: 'report_card_mp_board',
                loadChildren: 'app/modules/report-card/mp-board/report-card-mp-board.module#ReportCardMpBoardModule',
            },
            { path: 'report_card_cbse', loadChildren: 'app/modules/report-card/cbse/report-card-cbse.module#ReportCardCbseModule' },
            { path: 'salary', loadChildren: 'app/modules/salary/salary.module#SalaryModule' },
            { path: 'expenses', loadChildren: 'app/modules/expenses/expense.module#ExpenseModule' },
            { path: 'enquiries', loadChildren: 'app/modules/enquiry/enquiry.module#EnquiryModule' },
            { path: 'accounts', loadChildren: 'app/modules/accounts/accounts.module#AccountsModule' },
            { path: 'parent', loadChildren: 'app/modules/parent/parent.module#ParentModule' },
        ],
    },
    // ----- Routes For Print Pages Ends -------
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: CustomPreload,
            onSameUrlNavigation: 'reload',
        }),
    ],
    exports: [CommonModule, RouterModule],
    providers: [CustomPreload],
})
export class AppRoutingModule { }
