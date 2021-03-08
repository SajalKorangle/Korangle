import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TCComponent } from './tc.component';

const routes: Routes = [
    {
        path: 'settings',
        loadChildren: 'app/modules/tc/pages/settings/settings.module#SettingsModule',
        data: {moduleName: 'tc'},
    },
    {
        path: 'cancel_tc',
        loadChildren: 'app/modules/tc/pages/cancel-tc/cancel-tc.module#CancelTCModule',
        data: {moduleName: 'tc'},
    },
    {
        path: 'design_tc',
        loadChildren: 'app/modules/tc/pages/design-tc/design-tc.module#DesignTCModule',
        data: {moduleName: 'tc'},
    },
    {
        path: 'generate_tc',
        loadChildren: 'app/modules/tc/pages/generate-tc/generate-tc.module#GenerateTCModule',
        data: {moduleName: 'tc'},
    },
    {
        path: 'issue_tc',
        loadChildren: 'app/modules/tc/pages/issue-tc/issue-tc.module#IssueTCModule',
        data: {moduleName: 'tc'},
    },
    {
        path: 'tc_logbook',
        loadChildren: 'app/modules/tc/pages/tc-logbook/tc-logbook.module#TCLogbookModule',
        data: {moduleName: 'tc'},
    },
    {
        path: '',
        component: TCComponent,
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
export class TCRoutingModule { }
