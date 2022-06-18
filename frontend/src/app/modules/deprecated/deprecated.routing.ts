import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
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
    {
        path: 'examination_print_marksheet',
        loadChildren: 'app/modules/examination/pages/print-marksheet/print-marksheet.module#PrintMarksheetModule',
        data: { moduleName: 'deprecated' },
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeprecatedRoutingModule {}
