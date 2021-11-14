import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { DesignLayoutRouting } from './design-layout.routing';
import { DesignLayoutComponent } from './design-layout.component';
import { LocalComponentsModule } from './../../components/local-component.module';

@NgModule({
  declarations: [DesignLayoutComponent],
  imports: [
    ComponentsModule,
    DesignLayoutRouting,
    LocalComponentsModule,
  ],
  bootstrap: [DesignLayoutComponent]
})
export class DesignLayoutModule { }
