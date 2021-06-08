import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTutorialComponent } from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';

const routes: Routes = [
    {
        path: '',
        component: AddTutorialComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddTutorialRoutingModule {}
