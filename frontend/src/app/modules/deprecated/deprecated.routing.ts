import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

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
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeprecatedRoutingModule {}
