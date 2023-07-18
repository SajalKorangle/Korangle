export class SchoolMerchantAccount {
    id?: number;
    parentSchool: number;
    vendorId: string;
    isEnabled: boolean = true;
    easebuzzBankLabel: string = "";
    platformFeeOnSchoolType: string = "Percentage";
    percentageOfPlatformFeeOnSchool: number;
    maxPlatformFeeOnSchool: number;
    vendorData: {
        id?: string,
        name: string,
        addedOn?: string,
        status?: string,
        email: string,
        phone: string,
        settlementCycleId: number,
        bank:
        {
            accountNumber: string,
            accountHolder: string,
            ifsc: string,
        },
        upi?: string,
        balance?: number;
    } = {
            name: '',
            email: '',
            phone: '',
            settlementCycleId: null,
            bank: {
                accountNumber: '',
                accountHolder: '',
                ifsc: '',
            }
        };
}