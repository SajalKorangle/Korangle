import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreload } from './custom-preload';
import {ContactUsComponent} from './frontpage/contact-us/contact-us.component';
import {CreateSchoolComponent} from './frontpage/create-school/create-school.component';
import {LoginSignupComponent} from './frontpage/login-signup/login-signup.component';
import {ForgotPasswordComponent} from './frontpage/forgot-password/forgot-password.component';
import {PageNotFoundComponent} from './frontpage/page-not-found/page-not-found.component';
import {DashBoardComponent} from '@modules/dash-board.component';
import {DashboardAuthGuard} from './auth-guards/dashboard-auth-guard';
import {FrontpageAuthGuard} from './auth-guards/frontpage-auth-guard';

const routes: Routes = [

    // ----- Routes For Outside The User DashBoard Starts -------
    {path: 'contact-us', component: ContactUsComponent},
    {path: 'create-school', component: CreateSchoolComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [FrontpageAuthGuard]},
    {path: 'sign-up', component: LoginSignupComponent, canActivate: [FrontpageAuthGuard]},
    {path: 'login', component: LoginSignupComponent, canActivate: [FrontpageAuthGuard]},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    // ----- Routes For Outside The User DashBoard Ends -------

    // ----- Routes For inside User DashBoard Start -------
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [DashboardAuthGuard],
        data: { reuse: true },
        children: [
            {
                path: 'notification',
                loadChildren: 'app/modules/notification/notification.module#NotificationModule',
                // loadChildren: () => import('app/modules/students/student.module').then(m => m.StudentModule),
            },
            {
                path: 'students',
                loadChildren: 'app/modules/students/student.module#StudentModule',
                // loadChildren: () => import('app/modules/students/student.module').then(m => m.StudentModule),
            },
            {
                path: 'fees',
                loadChildren: 'app/modules/fees/fee.module#FeeModule',
                // loadChildren: () => import('app/modules/fees/fee.module').then(m => m.FeeModule),
            },
            {
                path: 'activity',
                loadChildren: 'app/modules/activity/activity.module#ActivityModule',
            },
            {
                path: 'sms',
                loadChildren: 'app/modules/sms/sms.module#SmsModule',
            },
            {
                path: 'complaints',
                loadChildren: 'app/modules/complaints/complaints.module#ComplaintsModule',
            },
            {
                path: 'attendance',
                loadChildren: 'app/modules/attendance/attendance.module#AttendanceModule',
            },
            {
                path: 'employees',
                loadChildren: 'app/modules/employee/employee.module#EmployeeModule',
            },
            {
                path: 'subjects',
                loadChildren: 'app/modules/subject/subject.module#SubjectModule',
            },
            {
                path: 'grade',
                loadChildren: 'app/modules/grade/grade.module#GradeModule',
            },
            {
                path: 'tutorials',
                loadChildren: 'app/modules/tutorials/tutorials.module#TutorialsModule',
            },
            {
                path: 'examinations',
                loadChildren: 'app/modules/examination/examination.module#ExaminationModule',
            },
            {
                path: 'report_card_3.0',
                loadChildren: 'app/modules/report-card-3/report-card.module#ReportCardModule',
            },
            {
                path: 'tc',
                loadChildren: 'app/modules/tc/tc.module#TCModule',
            },
            {
                path: 'salary',
                loadChildren: 'app/modules/salary/salary.module#SalaryModule',
            },
            {
                path: 'salary2',
                loadChildren: 'app/modules/salary2/salary2.module#Salary2Module',
            },
            {
                path: 'leaves',
                loadChildren: 'app/modules/leaves/leaves.module#LeavesModule',
            },
            {
                path: 'expenses',
                loadChildren: 'app/modules/expenses/expense.module#ExpenseModule',
            },
            {
                path: 'enquiries',
                loadChildren: 'app/modules/enquiry/enquiry.module#EnquiryModule',
            },
            {
                path: 'vehicle',
                loadChildren: 'app/modules/vehicle/vehicle.module#VehicleModule',
            },
            {
                path: 'job',
                loadChildren: 'app/modules/job/job.module#JobModule',
            },
            {
                path: 'user-settings',
                loadChildren: 'app/modules/user-settings/user-settings.module#UserSettingsModule',
                // loadChildren: () => import('app/modules/user-settings/user-settings.module').then(m => m.UserSettingsModule),
            },
            {
                path: 'parent',
                loadChildren: 'app/modules/parent/parent.module#ParentModule',
            },
            {
                path: 'class',
                loadChildren: 'app/modules/class/class.module#ClassModule',
            },
            {
                path: 'library',
                loadChildren: 'app/modules/library/library.module#LibraryModule',
            },
            {
                path: 'school',
                loadChildren: 'app/modules/school/school.module#SchoolModule',
            },
            {
                path: 'homework',
                loadChildren: 'app/modules/homework/homework.module#HomeworkModule',
            },
            {
                path: 'event_gallery',
                loadChildren: 'app/modules/event-gallery/event-gallery.module#EventGalleryModule',
            },
            {
                path: 'accounts',
                loadChildren: 'app/modules/accounts/accounts.module#AccountsModule',
            },
            {
                path: 'online_classes',
                loadChildren: 'app/modules/online-classes/online-classes.module#OnlineClassesModule',
            },
            {
                path: 'deprecated',
                loadChildren: 'app/modules/deprecated/deprecated.module#DeprecatedModule',
            },
            {
                path: 'website',
                loadChildren: 'app/modules/website/website.module#WebsiteModule',
            }
        ]
    },
    // ----- Routes For inside User DashBoard Ends -------

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
            { path: 'salary', loadChildren: 'app/modules/salary/salary.module#SalaryModule' },
            { path: 'enquiries', loadChildren: 'app/modules/enquiry/enquiry.module#EnquiryModule' },
            { path: 'accounts', loadChildren: 'app/modules/accounts/accounts.module#AccountsModule' },
            { path: 'parent', loadChildren: 'app/modules/parent/parent.module#ParentModule' },
            { path: 'complaints', loadChildren: 'app/modules/complaints/complaints.module#ComplaintsModule' },
            { path: 'deprecated', loadChildren: 'app/modules/deprecated/deprecated.module#DeprecatedModule' }
        ],
    },
    // ----- Routes For Print Pages Ends -------

    // ----- Any other route other than the above route's will be redirected to 404 page -------
    {path: '**', component: PageNotFoundComponent, pathMatch: 'full'},
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
