import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { DayDateComponent } from '@components/day-date/day-date.component';
import {ComponentsModule} from '@components/components.module';

describe('DayDateComponent', () => {

    let component: DayDateComponent;
    let fixture: ComponentFixture<DayDateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ComponentsModule ]
        }).compileComponents();
        fixture = TestBed.createComponent(DayDateComponent);
        component = fixture.componentInstance;
    }));

    it('Check nullDate function to be returning null date', async () => {
        component.onDateChanged = function(date) {
            expect(date.value).toBe(null);
        };
        component.nullDate();
    });

    /*it('Check onDateChanged function with various values', async () => {

        component.formattedDateOutput = true;

        component.onDateChanged = function(date) {
            expect(date.value).toBe(null);
        };
        component.nullDate();
    });*/

});
