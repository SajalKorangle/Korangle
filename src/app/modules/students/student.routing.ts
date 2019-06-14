import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { PrintICardsComponent } from './print/print-i-card/print-i-cards.component';
import  { PRINT_I_CARD } from '../../print/print-routes.constants';

const routes: Routes = [
    {
        path: '',
        component: StudentComponent,
    },
    {
        path: PRINT_I_CARD,
        component: PrintICardsComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class StudentRoutingModule { }
