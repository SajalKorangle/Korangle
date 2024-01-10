import { AddViaExcelComponent } from "./add-via-excel.component";
import { Book } from "@modules/library/models/book";

export class AddViaExcelServiceAdapter {
    vm: AddViaExcelComponent;

    constructor() {}

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId,
            },
            fields_list: ["bookNumber"],
        };
        const fetchUsedBookNumbers = await this.vm.genericService.getObjectList({ library_app: "Book" }, query);
        this.vm.usedBookNumbers = fetchUsedBookNumbers.map((book) => book.bookNumber);
        this.vm.isLoading = false;
    }

    getBookObj(bookData: Array<any>): Book {
        let bookObj = new Book();
        this.vm.mappedParameter.forEach((parameter, i) => {
            if (parameter.field !== "none") {
                if (parameter.parse) bookObj[parameter.field] = parameter.parse(bookData[i]);
                else bookObj[parameter.field] = bookData[i];
            }
        });
        bookObj.parentSchool = this.vm.user.activeSchool.dbId;
        return bookObj;
    }

    async uploadBooks(): Promise<Boolean> {
        let bookList: Array<Book> = [];
        this.vm.bookList.forEach((book) => {
            bookList.push(this.getBookObj(book));
        });
        let res = await this.vm.genericService.createObjectList(
            {
                library_app: "Book",
            },
            bookList
        );
        return !!res;
    }
}
