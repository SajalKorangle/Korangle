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

    async deleteBooks(): Promise<void> {
        this.vm.isLoading = true;
        let tasks = [];
        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let actionString = `Deleted ${this.vm.getSelectedBooks().length} books`;
        tasks.push(this.vm.genericService.deleteObjectList({ library_app: "Book" }, {
                filter: {
                    id__in: this.vm.getSelectedBooks().map((book) => book.id)
                }
        }));
        tasks.push(CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString));
        try {
            await Promise.all(tasks);
        } catch (err) {
            this.vm.isLoading = false;
            return;
        }
        alert("Books deleted successfully");

        this.vm.authorOptions = new Set();
        this.vm.publisherOptions = new Set();
        this.vm.bookTypeOptions = new Set();

        this.vm.selectedAuthors = [];
        this.vm.selectedPublishers = [];
        this.vm.selectedBookTypes = [];

        this.vm.searchBookName = '';

        this.initializeData();
    }

}