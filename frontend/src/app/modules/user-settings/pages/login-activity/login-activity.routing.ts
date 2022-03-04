import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginActivityComponent } from './login-activity.component';

const routes: Routes = [
    {
        path: '',
        component: LoginActivityComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginActivityRoutingModule {}
