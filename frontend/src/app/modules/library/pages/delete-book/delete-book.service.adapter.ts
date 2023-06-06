import { CommonFunctions } from '@modules/common/common-functions';
import { DeleteBookComponent } from "./delete-book.component";

export class DeleteBookServiceAdapter {
    vm: DeleteBookComponent;

    constructor() {}

    initializeAdapter(vm: DeleteBookComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            },
            fields_list: ["name", "author", "id", 'bookNumber', 'typeOfBook', 'publisher']
        };
        const fetchedBookList = await this.vm.genericService.getObjectList({ library_app: "Book" }, query);
        fetchedBookList.forEach(book => {
            const authorKey = book.author ? book.author.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            const publisherKey = book.publisher ?  book.publisher.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            const typeKey = book.typeOfBook ? book.typeOfBook.toLowerCase() : this.vm.NONE_FILTER_SELECTION;

            this.vm.authorOptions.add(authorKey);
            this.vm.publisherOptions.add(publisherKey);
            this.vm.bookTypeOptions.add(typeKey);
        });
        this.vm.completeBookList = fetchedBookList;
        this.vm.isLoading = false;
    }

}