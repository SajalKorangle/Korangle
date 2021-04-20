import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AccountSearchServiceAdapter } from './account-search.service.adapter';
import { AccountsService } from './../../../../services/modules/accounts/accounts.service';

@Component({
    selector: 'account-search',
    templateUrl: './account-search.component.html',
    styleUrls: ['./account-search.component.css'],
    providers: [AccountsService],
})
export class AccountSearchComponent implements OnInit {
    @Input() user;

    @Input() includeGroup: any;
    @Output() onDataLoaded = new EventEmitter<any>();

    @Output() onSelection = new EventEmitter<any>();

    accountsList: any;
    filteredAccountList: any;

    serviceAdapter: AccountSearchServiceAdapter;
    accountsForm = new FormControl();
    isLoading = false;

    constructor(public accountsService: AccountsService) {}

    ngOnInit(): void {
        this.serviceAdapter = new AccountSearchServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.filteredAccountList = this.accountsForm.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any).title)),
            map((title) => this.filterAccountList(title.toString()))
        );
    }

    filterAccountList(value: string): any {
        if (value === null || value === '') {
            return [];
        }
        return this.accountsList.filter((account) => {
            return account.title.toLowerCase().indexOf(value.toLowerCase()) === 0;
        });
    }

    handleAccountSelection(event) {
        this.onSelection.emit(event);
    }

    displayAccountFunction(account?: any): any {
        if (account) {
            if (typeof account == 'string') {
                return account;
            } else {
                return account.title;
            }
        }
        return '';
    }
}
