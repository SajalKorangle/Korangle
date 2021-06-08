import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TCLogbookComponent } from './tc-logbook.component';

const routes: Routes = [
    {
        path: '',
        component: TCLogbookComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TCLogbookRoutingModule {}
