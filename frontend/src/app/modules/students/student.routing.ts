import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { PrintICardsComponent } from './print/print-i-card/print-i-cards.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import { PrintMultipleICardsComponent } from './print/print-multiple-i-cards/print-multiple-i-cards.component';
import {
    PRINT_I_CARD,
    PRINT_TC,
    PRINT_STUDENT_LIST,
    PRINT_MULTIPLE_I_CARDS,
    PRINT_STUDENT_PROFILE,
} from '../../print/print-routes.constants';
import { PrintTransferCertificateSecondFormatComponent } from './print/print-transfer-certificate-second-format/print-transfer-certificate-second-format.component';
import { PrintStudentProfileComponent } from './print/print-student-profile/print-student-profile.component';

const routes: Routes = [
    {
        path: 'update_profile',
        loadChildren: 'app/modules/students/pages/update-profile/update-profile.module#UpdateProfileModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'view_all',
        loadChildren: 'app/modules/students/pages/view-all/view-all.module#ViewAllModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'generate_tc',
        loadChildren: 'app/modules/students/pages/generate-tc/generate-tc.module#GenerateTcModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'promote_student',
        loadChildren: 'app/modules/students/pages/promote-student/promote-student.module#PromoteStudentModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'change_class',
        loadChildren: 'app/modules/students/pages/change-class/change-class.module#ChangeClassModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'add_student',
        loadChildren: 'app/modules/students/pages/add-student/add-student.module#AddStudentModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'upload_list',
        loadChildren: 'app/modules/students/pages/upload_list/upload-list.module#UploadListModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'update_all',
        loadChildren: 'app/modules/students/pages/update_all/update-all.module#UpdateAllModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'delete_student',
        loadChildren: 'app/modules/students/pages/delete-student/delete-student.module#DeleteStudentModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'i_cards',
        loadChildren: 'app/modules/students/pages/i-cards/i-cards.module#ICardsModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'print_profile',
        loadChildren: 'app/modules/students/pages/print-profile/print-profile.module#PrintProfileModule',
        data: { moduleName: 'students' },
    },
    {
        path: 'manage_parameter',
        loadChildren: 'app/modules/students/pages/manage-parameter/manage-parameter.module#ManageParameterModule',
        data: { moduleName: 'students' },
    },
    {
        path: '',
        component: StudentComponent,
    },
    {
        path: PRINT_I_CARD,
        component: PrintICardsComponent,
    },
    {
        path: PRINT_MULTIPLE_I_CARDS,
        component: PrintMultipleICardsComponent,
    },
    {
        path: PRINT_TC,
        component: PrintTransferCertificateSecondFormatComponent,
    },
    {
        path: PRINT_STUDENT_LIST,
        component: PrintStudentListComponent,
    },
    {
        path: PRINT_STUDENT_PROFILE,
        component: PrintStudentProfileComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentRoutingModule {}
