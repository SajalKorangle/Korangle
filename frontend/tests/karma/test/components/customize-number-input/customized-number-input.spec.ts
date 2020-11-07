import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CustomizedNumberInputComponent} from '@components/customized-number-input/customized-number-input.component';
import {ComponentsModule} from '@components/components.module';
import {EventEmitter} from '@angular/core';

describe('CustomizedNumberInputComponent', () => {

    let component: CustomizedNumberInputComponent;
    let fixture: ComponentFixture<CustomizedNumberInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ComponentsModule ]
        }).compileComponents();
        fixture = TestBed.createComponent(CustomizedNumberInputComponent);
        component = fixture.componentInstance;
    }));

    it('Check isValidNumber function for all possibilities', async () => {

        // For true
        const invalid_list = [
            null,
            undefined,
            '',
            'abc',
            'a1',
            '1.1.'
        ];
        invalid_list.forEach(value => {
            expect(component.isValidNumber(value)).toBe(false);
        });

        // For false
        const valid_list = [
            0,
            '0',
            123,
            1.,
            1.2,
            1.0,
            '1.0',
            '0.123',
            '-4',
            -4.2
        ];
        valid_list.forEach(value => {
            expect(component.isValidNumber(value)).toBe(true);
        });

    });

    it('Check handleChange function for all possibilities', fakeAsync(() => {

        const element = document.getElementsByTagName('input')[0];

        component.maximumDecimal = 2;
        component.minimum = -4;
        component.maximum = 100;

        // For false
        const value_list = [
            { inputValue: 123, outputValue: 100, targetValue: '100'},
            { inputValue: 1., outputValue: 1., targetValue: '1'},
            { inputValue: -5, outputValue: -4, targetValue: '-4'},
            { inputValue: -5.23, outputValue: -4, targetValue: '-4'},
            { inputValue: -3.236, outputValue: -3.24, targetValue: '-3.24'},
            { inputValue: 1.2, outputValue: 1.2, targetValue: '1.2'},
            { inputValue: 1.0, outputValue: 1.0, targetValue: '1'},
            { inputValue: 0.123, outputValue: 0.12, targetValue: '0.12'},
            { inputValue: null, outputValue: null, targetValue: ''}
        ];
        value_list.forEach(value => {
            // console.log(value);
            component.outputValue = new EventEmitter<any>();
            component.outputValue.subscribe(function (outputValue) {
                expect(typeof outputValue).toBe(typeof value.outputValue);
                expect(outputValue).toBe(value.outputValue);
            });
            element.value = value.inputValue ? value.inputValue.toString() : '';
            component.handleChange(value.inputValue, element);
            expect(typeof element.value).toBe(typeof value.targetValue);
            expect(element.value).toBe(value.targetValue);
            tick(1000);
        });

    }));

    it('Check onBlur function for all possibilities', fakeAsync(() => {

        const element = document.getElementsByTagName('input')[0];

        component.maximumDecimal = 2;
        component.minimum = -4;
        component.maximum = 100;

        // For false
        const value_list = [
            { inputValue: 123, outputValue: 100, targetValue: '100'},
            { inputValue: 1., outputValue: 1., targetValue: '1'},
            { inputValue: -5, outputValue: -4, targetValue: '-4'},
            { inputValue: -5.23, outputValue: -4, targetValue: '-4'},
            { inputValue: -3.236, outputValue: -3.24, targetValue: '-3.24'},
            { inputValue: 1.2, outputValue: 1.2, targetValue: '1.2'},
            { inputValue: 1.0, outputValue: 1.0, targetValue: '1'},
            { inputValue: 0.123, outputValue: 0.12, targetValue: '0.12'},
            { inputValue: '', outputValue: -4, targetValue: '-4'}
        ];
        value_list.forEach(value => {
            component.outputValue = new EventEmitter<any>();
            component.outputValue.subscribe(function (outputValue) {
                expect(typeof outputValue).toBe(typeof value.outputValue);
                expect(outputValue).toBe(value.outputValue);
            });
            element.value = value.inputValue.toString();
            component.onBlur({target: element});
            expect(typeof element.value).toBe(typeof value.targetValue);
            expect(element.value).toBe(value.targetValue);
            tick(1000);
        });

    }));

});
