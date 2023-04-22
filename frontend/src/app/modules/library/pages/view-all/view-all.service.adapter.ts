import { type } from 'os';
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
            const authorKey = book.author ? book.author.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            const publisherKey = book.publisher ?  book.publisher.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            const typeKey = book.typeOfBook ? book.typeOfBook.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            this.vm.authorsSelected.add(authorKey);
            this.vm.publishersSelected.add(publisherKey);
            this.vm.bookTypesSelected.add(typeKey);
        });

        this.vm.initializeBookList(fetchedBookList);
        this.vm.isLoading = false;
    }
}
