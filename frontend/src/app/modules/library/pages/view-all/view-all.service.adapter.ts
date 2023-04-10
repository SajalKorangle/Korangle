import { ViewAllComponent } from './view-all.component';
import { CommonFunctions } from '@classes/common-functions';

export class ViewAllServiceAdapter {
    vm: ViewAllComponent;

    constructor() { }

    initializeAdapter(vm: ViewAllComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;

        try {
            const fetchedBookList = await this.vm.genericService.getObjectList({library_app: "Book"}, {});
            this.vm.initializeBookList(fetchedBookList);
            this.vm.isLoading = false;
        } catch {
            this.vm.isLoading = false;
        }


    }
}
