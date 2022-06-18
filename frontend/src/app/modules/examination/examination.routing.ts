import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExaminationComponent } from './examination.component';
import { PRINT_HALL_TICKET, PRINT_STUDENT_MARKSHEET } from './print/print-routes.constants';

import { PrintHallTicketComponent } from './print/print-hall-ticket/print-hall-ticket.component';
import { PrintStudentMarksheetListComponent } from './print/print-student-marksheet-list/print-student-marksheet-list.component';

const routes: Routes = [
    {
        path: 'create_examination',
        loadChildren: 'app/modules/examination/pages/create-examination/create-examination.module#CreateExaminationModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'create_test',
        loadChildren: 'app/modules/examination/pages/create-test/create-test.module#CreateTestModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'schedule_test',
        loadChildren: 'app/modules/examination/pages/schedule-test/schedule-test.module#ScheduleTestModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'generate_hall_ticket',
        loadChildren: 'app/modules/examination/pages/generate-hall-ticket/generate-hall-ticket.module#GenerateHallTicketModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'update_marks',
        loadChildren: 'app/modules/examination/pages/update-marks/update-marks.module#UpdateMarksModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'view_marks',
        loadChildren: 'app/modules/examination/pages/view-marks/view-marks.module#ViewMarksModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'add_student_remarks',
        loadChildren: 'app/modules/examination/pages/add-student-remarks/add-student-remarks.module#AddStudentRemarksModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: 'view_student_remarks',
        loadChildren: 'app/modules/examination/pages/view-student-remarks/view-student-remarks.module#ViewStudentRemarksModule',
        data: { moduleName: 'examinations' },
    },
    {
        path: '',
        component: ExaminationComponent,
    },
    {
        path: PRINT_HALL_TICKET,
        component: PrintHallTicketComponent,
    },
    {
        path: PRINT_STUDENT_MARKSHEET,
        component: PrintStudentMarksheetListComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExaminationRoutingModule {}
