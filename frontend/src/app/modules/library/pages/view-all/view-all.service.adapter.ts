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
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            }
        };
        const fetchedBookList = await this.vm.genericService.getObjectList({library_app: "Book"}, query);

        fetchedBookList.forEach(book => {
            book.author && this.vm.authorsSelected.set(book.author.toLowerCase(), false);
            book.publisher && this.vm.publishersSelected.set(book.publisher.toLowerCase(), false);
            book.typeOfBook && this.vm.bookTypesSelected.set(book.typeOfBook.toLowerCase(), false);
        })


        this.vm.initializeBookList(fetchedBookList);
        this.vm.isLoading = false;


    }
}
