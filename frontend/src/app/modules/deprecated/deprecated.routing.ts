import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
    PRINT_EXPENSES, 
    PRINT_STUDENT_CLASSIC_FINAL_REPORT, 
    PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT, 
    PRINT_STUDENT_ELEGANT_FINAL_REPORT, 
    PRINT_STUDENT_ELEVENTH_FINAL_REPORT, 
    PRINT_STUDENT_JUNIOR_REPORT, 
    PRINT_STUDENT_NINTH_FINAL_REPORT, 
    PRINT_STUDENT_NINTH_FINAL_REPORT_2019, 
    PRINT_STUDENT_SENIOR_REPORT 
} from '../../print/print-routes.constants'
import { PrintExpensesComponent } from '@modules/expenses/print/print-expenses/print-expenses.component';
import { ReportCardCbseComponent } from '@modules/report-card/cbse/report-card-cbse.component';
import { PrintStudentJuniorReportListComponent } from '@modules/report-card/cbse/print/print-student-junior-report-list/print-student-junior-report-list.component';
import { PrintStudentSeniorReportListComponent } from '@modules/report-card/cbse/print/print-student-senior-report-list/print-student-senior-report-list.component';
import { ReportCardMpBoardComponent } from '@modules/report-card/mp-board/report-card-mp-board.component';
import { PrintStudentNinthFinalReportListComponent } from '@modules/report-card/mp-board/print/print-student-ninth-final-report-list/print-student-ninth-final-report-list.component';
import { PrintStudentNinthFinalReportList2019Component } from '@modules/report-card/mp-board/print/print-student-ninth-final-report-list-2019/print-student-ninth-final-report-list-2019.component';
import { PrintStudentEleventhFinalReportListComponent } from '@modules/report-card/mp-board/print/print-student-eleventh-final-report-list/print-student-eleventh-final-report-list.component';
import { PrintStudentComprehensiveFinalReportListComponent } from '@modules/report-card/mp-board/print/print-student-comprehensive-final-report-list/print-student-comprehensive-final-report-list.component';
import { PrintStudentElegantFinalReportListComponent } from '@modules/report-card/mp-board/print/print-student-elegant-final-report-list/print-student-elegant-final-report-list.component';
import { PrintStudentClassicFinalReportListComponent } from '@modules/report-card/mp-board/print/print-student-classic-final-report-list/print-student-classic-final-report-list.component';

const routes: Routes = [

    // Student Module
    {
        path: 'student_generate_tc',
        loadChildren: 'app/modules/students/pages/generate-tc/generate-tc.module#GenerateTcModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'student_i_cards',
        loadChildren: 'app/modules/students/pages/i-cards/i-cards.module#ICardsModule',
        data: { moduleName: 'deprecated' },
    },

    // Examination Module
    {
        path: 'examination_print_marksheet',
        loadChildren: 'app/modules/examination/pages/print-marksheet/print-marksheet.module#PrintMarksheetModule',
        data: { moduleName: 'deprecated' },
    },

    // Report Card CBSE Module
    {
        path: 'cbse_rc_grade_student_fields',
        loadChildren: 'app/modules/report-card/cbse/pages/grade-student-fields/grade-student-fields.module#GradeStudentFieldsModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'cbse_rc_set_final_report',
        loadChildren: 'app/modules/report-card/cbse/pages/set-final-report/set-final-report.module#SetFinalReportModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'cbse_rc_generate_final_report',
        loadChildren: 'app/modules/report-card/cbse/pages/generate-final-report/generate-final-report.module#GenerateFinalReportModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'cbse_rc_add_student_remarks',
        loadChildren: 'app/modules/report-card/cbse/pages/add-student-remarks/add-student-remarks.module#AddStudentRemarksModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'cbse_rc_view_grades_remarks',
        loadChildren: 'app/modules/report-card/cbse/pages/view-grades-remarks/view-grades-remarks.module#ViewGradesRemarksModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: '',
        component: ReportCardCbseComponent,
    },
    {
        path: PRINT_STUDENT_JUNIOR_REPORT,
        component: PrintStudentJuniorReportListComponent,
    },
    {
        path: PRINT_STUDENT_SENIOR_REPORT,
        component: PrintStudentSeniorReportListComponent,
    },

    // Report Card MP Board Module
    {
        path: 'mp_rc_update_cce_marks',
        loadChildren: 'app/modules/report-card/mp-board/pages/update-cce-marks/update-cce-marks.module#UpdateCceMarksModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_grade_student_fields',
        loadChildren: 'app/modules/report-card/mp-board/pages/grade-student-fields/grade-student-fields.module#GradeStudentFieldsModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_set_final_report',
        loadChildren: 'app/modules/report-card/mp-board/pages/set-final-report/set-final-report.module#SetFinalReportModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_generate_final_report',
        loadChildren: 'app/modules/report-card/mp-board/pages/generate-final-report/generate-final-report.module#GenerateFinalReportModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_generate_patrak',
        loadChildren: 'app/modules/report-card/mp-board/pages/generate-patrak/generate-patrak.module#GeneratePatrakModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_generate_goshwara',
        loadChildren: 'app/modules/report-card/mp-board/pages/generate-goshwara/generate-goshwara.module#GenerateGoshwaraModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'mp_rc_add_student_remarks',
        loadChildren: 'app/modules/report-card/mp-board/pages/add-student-remarks/add-student-remarks.module#AddStudentRemarksModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: '',
        component: ReportCardMpBoardComponent,
    },
    {
        path: PRINT_STUDENT_NINTH_FINAL_REPORT,
        component: PrintStudentNinthFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_NINTH_FINAL_REPORT_2019,
        component: PrintStudentNinthFinalReportList2019Component,
    },
    {
        path: PRINT_STUDENT_ELEVENTH_FINAL_REPORT,
        component: PrintStudentEleventhFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT,
        component: PrintStudentComprehensiveFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_ELEGANT_FINAL_REPORT,
        component: PrintStudentElegantFinalReportListComponent,
    },
    {
        path: PRINT_STUDENT_CLASSIC_FINAL_REPORT,
        component: PrintStudentClassicFinalReportListComponent,
    },

    // Expenses Module
    {
        path: 'expense_add_expense',
        loadChildren: 'app/modules/expenses/pages/add-expense/add-expense.module#AddExpenseModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: 'expense_expense_list',
        loadChildren: 'app/modules/expenses/pages/expense-list/expense-list.module#ExpenseListModule',
        data: { moduleName: 'deprecated' },
    },
    {
        path: PRINT_EXPENSES,
        component: PrintExpensesComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeprecatedRoutingModule {}
