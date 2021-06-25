import { AddFeeTypeComponent } from './add-fee-type.component';

export class AddFeeTypeServiceAdapter {
    vm: AddFeeTypeComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: AddFeeTypeComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        let request_fee_type_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.isLoading = true;

        this.vm.feeService.getObjectList(this.vm.feeService.fee_type, request_fee_type_data).then(
            (value) => {
                this.populateFeeTypeList(value);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateFeeTypeList(data: any): void {
        this.vm.feeTypeList = data.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
        });
        this.vm.feeTypeList.forEach((feeType) => {
            feeType['newName'] = feeType['name'];
            feeType['newOrderNumber'] = feeType['orderNumber'];
            feeType['updating'] = false;
        });
        this.vm.feeTypeOrderNumberToBeAdded = this.vm.feeTypeList.length + 1;
    }

    createFeeType(): void {
        if (this.vm.feeTypeNameToBeAdded === null || this.vm.feeTypeNameToBeAdded == '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.feeTypeOrderNumberToBeAdded === null || this.vm.feeTypeOrderNumberToBeAdded == '') {
            alert('Order Number should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.feeTypeList.every((feeType) => {
            if (feeType.name === this.vm.feeTypeNameToBeAdded) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Name already Exists');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            name: this.vm.feeTypeNameToBeAdded,
            orderNumber: this.vm.feeTypeOrderNumberToBeAdded,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.feeService.createObject(this.vm.feeService.fee_type, data).then(
            (value) => {
                this.addToFeeTypeList(value);
                this.vm.feeTypeNameToBeAdded = null;
                this.vm.feeTypeOrderNumberToBeAdded = this.vm.feeTypeList.length + 1;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    addToFeeTypeList(feeType: any): void {
        feeType['newName'] = feeType['name'];
        feeType['newOrderNumber'] = feeType['orderNumber'];
        feeType['updating'] = false;
        this.vm.feeTypeList.push(feeType);
    }

    // Update feeType
    updateFeeType(feeType: any): void {
        if (feeType.newName === null || feeType.newName == '') {
            alert('Name should be populated');
            return;
        }

        if (feeType.newOrderNumber === null || feeType.newOrderNumber == '') {
            alert('Order Number should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.feeTypeList.every((item) => {
            if (item.name === feeType.newName && item.id !== feeType.id) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Name already Exists');
            return;
        }

        feeType.updating = true;

        let data = {
            id: feeType.id,
            name: feeType.newName,
            orderNumber: feeType.newOrderNumber,
            parentSchool: feeType.parentSchool,
        };

        this.vm.feeService.updateObject(this.vm.feeService.fee_type, data).then(
            (value) => {
                alert('Fee Type updated successfully');
                feeType.name = value.name;
                feeType.orderNumber = value.orderNumber;
                feeType.updating = false;
            },
            (error) => {
                feeType.updating = false;
            }
        );
    }
}
