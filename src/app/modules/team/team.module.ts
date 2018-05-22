import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { TeamComponent } from './team.component';

import { AddMemberComponent } from './pages/add-member/add-member.component';
import { AssignTaskComponent } from './pages/assign-task/assign-task.component';
import { RemoveMemberComponent } from './pages/remove-member/remove-member.component';

import { TeamRoutingModule } from './team.routing';

@NgModule({
    declarations: [

        TeamComponent,

        AddMemberComponent,
        AssignTaskComponent,
        RemoveMemberComponent,

    ],

    imports: [

        TeamRoutingModule,
        ComponentsModule,

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [TeamComponent]
})
export class TeamModule { }
