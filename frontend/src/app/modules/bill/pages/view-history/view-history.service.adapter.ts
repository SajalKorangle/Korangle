import { ViewHistoryComponent } from './view-history.component';

export class ViewHistoryServiceAdapter {

    vm: ViewHistoryComponent;

    initialiseAdapter(vm: ViewHistoryComponent) {
        this.vm = vm;
    }

    initialiseData() {
    }

}