import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IdCardComponent } from './id-card.component';

const routes: Routes = [
    {
        path: 'design_layout',
        loadChildren: 'app/modules/id-card/pages/design-layout/design-layout.module#DesignLayoutModule',
        data: { moduleName: 'id_card' }, // TODO: These should be called modulePath instead of moduleName everywhwere
    },
    {
        path: 'generate_id_card',
        loadChildren: 'app/modules/id-card/pages/generate-id-card/generate-id-card.module#GenerateIdCardModule',
        data: { moduleName: 'id_card' }, // TODO: These should be called modulePath instead of moduleName everywhwere
    },
    {
        path: '',
        component: IdCardComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IdCardRoutingModule {}
