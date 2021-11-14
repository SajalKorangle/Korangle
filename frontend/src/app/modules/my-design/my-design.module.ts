import { NgModule } from '@angular/core';
import { ComponentsModule } from './../../components/components.module';
import { MyDesignComponent } from './my-design.component';
import { ReportCardRoutingModule } from './my-design.routing';

@NgModule({
    declarations: [MyDesignComponent],
    imports: [ComponentsModule, ReportCardRoutingModule],
    bootstrap: [MyDesignComponent],
})
export class MyDesignModule { }
