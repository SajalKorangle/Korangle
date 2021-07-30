import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { DesignLayoutRouting } from './design-layout.routing';
import { DesignLayoutComponent } from './design-layout.component';

// import { ParametersPannelModule } from '@modules/my-design/components/parameters-pannel.module';
@NgModule({
  declarations: [DesignLayoutComponent],
  imports: [
    ComponentsModule,
    DesignLayoutRouting,
    // ParametersPannelModule
  ],
  bootstrap: [DesignLayoutComponent]
})
export class DesignLayoutModule { }
