import { AccountSession } from '@services/modules/accounts/models/account-session';

export const HEADS_LIST = [
    {id: 1, title: 'Expenses'},
    {id: 2, title: 'Income'},
    {id: 3, title: 'Assets'},
    {id: 4, title: 'Liabilities'},
];

export const APPROVAL_STATUS = {
    'APPROVED': 'APPROVED',
    'PENDING': 'PENDING',
    'DECLINED': 'DECLINED',
};

export const NEGATIVE_BALANCE_COLOR = 'red';
export const POSITIVE_BALANCE_COLOR = 'rgba(86, 142, 174, 1)';

export interface customAccount extends AccountSession{
    title: string;
    type: string;
}

export interface customGroupStructure extends customAccount{
    childs: Array<customGroupStructure | customAccount | any>;
}