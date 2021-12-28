import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CustomPreload } from './custom-preload';

const routes: Routes = [
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
        path: 'id_card',
        loadChildren: 'app/modules/id-card/id-card.module#IdCardModule',
        // loadChildren: () => import('app/modules/fees/fee.module').then(m => m.FeeModule),
    },
    {
        path: 'sms',
        loadChildren: 'app/modules/sms/sms.module#SmsModule',
    },
    {
        path: 'activity',
        loadChildren: 'app/modules/activity/activity.module#ActivityModule',
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
        path: 'report_card_mp_board',
        loadChildren: 'app/modules/report-card/mp-board/report-card-mp-board.module#ReportCardMpBoardModule',
    },
    {
        path: 'report_card_cbse',
        loadChildren: 'app/modules/report-card/cbse/report-card-cbse.module#ReportCardCbseModule',
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
