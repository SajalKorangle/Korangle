import {QUERY_INTERFACE, APP_MODEL_STRUCTURE_INTERFACE, FILTER_TYPE, GenericService} from './generic-service';


export class Query<T extends keyof APP_MODEL_STRUCTURE_INTERFACE> {

    data: { [key: string]: any } = {};
    query_data: QUERY_INTERFACE = {};

    app_name: T;
    model_name: APP_MODEL_STRUCTURE_INTERFACE[T];

    serviceObject: GenericService;
    constructor(serviceObject: GenericService, app_name: T, model_name: APP_MODEL_STRUCTURE_INTERFACE[T]) {
        this.serviceObject = serviceObject;
        this.app_name = app_name;
        this.model_name = model_name;
    }

    filter(filter: FILTER_TYPE) {
        if(this.data.filter){
            Object.assign(this.data.filter, filter);
        }
        else{
            this.data.filter = filter;
        }
        return this;
    }

}

