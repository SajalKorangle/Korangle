import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsComponent } from '@modules/user-settings/pages/contact-us/contact-us.component';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {ComponentsModule} from '@components/components.module';

describe('ContactUsComponent', () => {
    let component: ContactUsComponent;
    let fixture: ComponentFixture<ContactUsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ContactUsComponent ],
            imports: [ BasicComponentsModule, ComponentsModule ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactUsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('check isMobile', () => {
        expect(component.isMobile()).toBe(false);
    });
});
