import { ViewBookFlowComponent } from "./view-book-flow.component";

export class ViewBookFlowServiceAdapter {
    vm: ViewBookFlowComponent;
    constructor() { }

    initializeAdapter(vm: ViewBookFlowComponent): void {
        this.vm = vm;
        this.getBookList();
    }

    getBookList() {
        this.vm.isLoading = true;
        const query = {
            filter: {
                parentSchool_id: this.vm.user.activeSchool.dbId
            },
            annotate: {
                isIssued: {
                    function: "Count",
                    field: "book_issue_record",
                    filter: {
                        book_issue_record__depositTime: null
                    }
                }
            },
            fields_list: ["isIssued", "__all__"]
        };

        this.vm.genericService.getObjectList({ library_app: "Book" }, query).then((books) => {
            this.vm.booksList = books;
            this.vm.isLoading = false;
        });
    }
}