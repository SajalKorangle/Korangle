import { TransferCertificateSettings } from './../../../services/modules/tc/models/transfer-certificate-settings';

export const TC_SCHOOL_FEE_RULE_NAME = 'TC FEE(Software Generated)';

export class DEFAULT_TC_SETTINGS implements TransferCertificateSettings{
    id: number = null;
    parentSchool: number;
    tcFee: number = 0;
    parentFeeType: number = null;
    
    nextCertificateNumber: number = 1;
    constructor(parentSchool: number) {
        this.parentSchool = parentSchool;
    }
}