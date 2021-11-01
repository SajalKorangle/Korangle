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

    getQuery(){
        return this.query_data;
    }

    filter(filter: FILTER_TYPE) {
        if(!this.data.filter){
            this.data.filter = {}
        }
        Object.assign(this.data.filter, filter);
        return this;
    }

    exclude(filter: FILTER_TYPE) {
        if(!this.data.exclude){
            this.data.exclude = {}
        }
        Object.assign(this.data.exclude, filter);
        return this;
    }

    setFields(...fields_list: Array<string>){
        this.data.fields_list = fields_list;
        return this;
    }

    addParentQuery(name: string, parent_query: Query<T>){
        if(!this.query_data.parent_query){
            this.query_data.parent_query = {};
        }
        this.data.parent_query[name] = parent_query;
        return this;
    }

    addChildQuery(name: string, child_query: Query<T>){
        if(!this.query_data.child_query){
            this.query_data.parent_query = {};
        }
        this.data.child_query[name] = child_query;
        return this;
    }

    union(...query_list: Array<Query<T>>){
        if(!this.query_data.union){
            this.query_data.union = [];
        }
        this.query_data.union.push(...query_list.map(q=>q.getQuery()));
        return this;
    }

    annotate(key: string, field: string, function_name: string, filter?: FILTER_TYPE){
        if(!this.query_data.annotate){
            this.query_data.annotate = {};
        }
        this.query_data.annotate[key] = { field, function: function_name };
        if(filter){
            this.query_data.annotate[key].filter = filter;
        }
        return this;
    }

    orderBy(...fields_list: Array<string>){
        this.query_data.order_by = fields_list;
        return this;
    }

    paginate(start: number, end: number){
        this.query_data.pagination = { start, end};
        return this;
    }

}

