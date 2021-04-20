import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GenerateFeesCertificateComponent } from './generate-fees-certificate.component';

const routes: Routes = [
    {
        path: '',
        component: GenerateFeesCertificateComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GenerateFeesCertificateRoutingModule {}
