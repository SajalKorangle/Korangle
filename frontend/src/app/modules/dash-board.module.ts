import { NgModule } from '@angular/core';
import {DashBoardComponent} from '@modules/dash-board.component';
import {DashBoardRoutingModule} from '@modules/dash-board.routing';

@NgModule({
    declarations: [DashBoardComponent],
    imports: [DashBoardRoutingModule],
})
export class DashBoardModule {}
