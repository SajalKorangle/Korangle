/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async } from '@angular/core/testing';


import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { NewExpenseComponent } from './new-expense.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import {ExpenseService} from '../expense.service';
import { User } from '../../classes/user';

import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';

import { HttpModule } from '@angular/http';
import {Expense} from '../../classes/expense';

class ExpenseServiceSpy {

}

describe('NewExpenseComponent (inline template)', () => {

    let comp:    NewExpenseComponent;
    let fixture: ComponentFixture<NewExpenseComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;

    beforeEach(async(() => {

        const expenseServiceSpy = new ExpenseServiceSpy();

        TestBed.configureTestingModule({
            imports: [ FormsModule, HttpModule ],
            declarations: [ NewExpenseComponent, LoadingSpinnerComponent ], // declare the test component
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
            ]
        }).overrideComponent( NewExpenseComponent, {
            set: {
                providers: [
                    { provide: ExpenseService, useValue: expenseServiceSpy }
                ]
            }
        }).compileComponents();
    }));

    beforeEach(() => {

        // const expenseService = TestBed.get(ExpenseService);

        fixture = TestBed.createComponent(NewExpenseComponent);

        comp = fixture.componentInstance; // NewExpenseComponent test instance
        comp.user = new User();
        fixture.detectChanges();

        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('input'));
        el = de.nativeElement;
    });

    it('should pass', () => {
        // fixture.detectChanges();
        // expect(el.nodeValue).toContain(comp.todaysDate());
    });

    it('should fail', () => {
        comp.newExpense.voucherDate = '2018-01-01';
        fixture.detectChanges();
        expect(el.nodeValue).toContain(comp.todaysDate());
    });

});
*/
