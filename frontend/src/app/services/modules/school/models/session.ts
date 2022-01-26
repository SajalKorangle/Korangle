export class Session {
    id: number;
    startDate: string = null;
    endDate: string = null;
    name: string = null;
    orderNumber: number = null;
}

export const SESSION_CONSTANT = [
    { id: 1, startDate: '2017-04-01', endDate: '2018-03-31', name: 'Session 2017-18', orderNumber: 1 },
    { id: 2, startDate: '2018-04-01', endDate: '2019-03-31', name: 'Session 2018-19', orderNumber: 2 },
    { id: 3, startDate: '2019-04-01', endDate: '2020-03-31', name: 'Session 2019-20', orderNumber: 3 },
    { id: 4, startDate: '2020-04-01', endDate: '2021-03-31', name: 'Session 2020-21', orderNumber: 4 },
    { id: 5, startDate: '2021-04-01', endDate: '2022-03-31', name: 'Session 2021-22', orderNumber: 5 },
    { id: 6, startDate: '2022-04-01', endDate: '2023-03-31', name: 'Session 2022-23', orderNumber: 6 },
    { id: 7, startDate: '2023-04-01', endDate: '2024-03-31', name: 'Session 2023-24', orderNumber: 7 },
    { id: 8, startDate: '2024-04-01', endDate: '2025-03-31', name: 'Session 2024-25', orderNumber: 8 },
];
