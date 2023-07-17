import { CommonFunctions } from '@modules/common/common-functions';
import { AddViaExcelComponent } from "./add-via-excel.component";

export class AddViaExcelServiceAdapter {
    vm: AddViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            },
            fields_list: ["bookNumber"]
        };
        const fetchUsedBookNumbers = await this.vm.genericService.getObjectList({ library_app: "Book" }, query);
        this.vm.usedBookNumbers = fetchUsedBookNumbers.map((book) => book.bookNumber);
        this.vm.isLoading = false;
    }
}