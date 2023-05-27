import { CommonFunctions } from '@modules/common/common-functions';
import { UpdateBookComponent } from "./update-book.component";

export class UpdateBookServiceAdapter {
    vm: UpdateBookComponent;

    constructor() {}

    initializeAdapter(vm: UpdateBookComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.setBookListLoading(true);

        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            }
        };
        const fetchedBookList = await this.vm.genericService.getObjectList({library_app: "Book"}, query);

        this.vm.bookList = fetchedBookList;
        this.vm.setBookListLoading(false);
    }

}