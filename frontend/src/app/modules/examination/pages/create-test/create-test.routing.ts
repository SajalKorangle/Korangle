import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CreateTestComponent } from './create-test.component';

const routes: Routes = [
    {
        path: '',
        component: CreateTestComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateTestRoutingModule {}
