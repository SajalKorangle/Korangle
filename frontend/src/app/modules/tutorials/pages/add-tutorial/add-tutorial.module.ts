import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { AddTutorialRoutingModule } from './add-tutorial.routing';
import { AddTutorialComponent } from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';
import { MatProgressSpinnerModule } from '@angular/material';
import {YouTubePlayerModule} from '@angular/youtube-player';

@NgModule({
    declarations: [AddTutorialComponent],
    imports: [AddTutorialRoutingModule, ComponentsModule, MatProgressSpinnerModule, YouTubePlayerModule],
    providers: [],
    bootstrap: [AddTutorialComponent],
})
export class AddTutorialModule {}
