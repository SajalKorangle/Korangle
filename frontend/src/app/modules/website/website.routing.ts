import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebsiteComponent } from './website.component';


const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent
    },
    {
        path: 'manage_website',
        loadChildren: 'app/modules/website/pages/manage-website/manage-website.module#ManageWebsiteModule',
        data: { moduleName: 'website' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutingModule { }
