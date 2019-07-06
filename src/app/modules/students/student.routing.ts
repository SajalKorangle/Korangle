import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { PrintICardsComponent } from './print/print-i-card/print-i-cards.component';
import { PrintStudentListComponent } from './print/print-student-list/print-student-list.component';
import {PrintMultipleICardsComponent} from "./print/print-multiple-i-cards/print-multiple-i-cards.component";
import {PRINT_I_CARD, PRINT_TC, PRINT_STUDENT_LIST, PRINT_MULTIPLE_I_CARDS} from '../../print/print-routes.constants';

const routes: Routes = [
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
        component: PrintICardsComponent,
    },
    {
        path: PRINT_STUDENT_LIST,
        component: PrintStudentListComponent,
    }
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
