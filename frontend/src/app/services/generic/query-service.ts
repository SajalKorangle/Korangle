import {QUERY_INTERFACE, APP_MODEL_STRUCTURE_INTERFACE, FILTER_TYPE, GenericService} from './generic-service';


export class Query{

    data: { [key: string]: any };
    query_data: QUERY_INTERFACE = {};

    config: Partial<APP_MODEL_STRUCTURE_INTERFACE>;

    serviceObject: GenericService;
    constructor(serviceObject: GenericService, config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data?: any) {
        this.serviceObject = serviceObject;
        this.config = config;
        this.data = data;
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

    addParentQuery(name: string, parent_query: Query){
        if(!this.query_data.parent_query){
            this.query_data.parent_query = {};
        }
        this.data.parent_query[name] = parent_query;
        return this;
    }

    addChildQuery(name: string, child_query: Query){
        if(!this.query_data.child_query){
            this.query_data.parent_query = {};
        }
        this.data.child_query[name] = child_query;
        return this;
    }

    union(...query_list: Array<Query>){
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

    getObject() {
        return this.serviceObject.getObject(this.config, this.getQuery());
    }

    getObjectList() {
        return this.serviceObject.getObjectList(this.config, this.getQuery());
    }

    createObject() {
        return this.serviceObject.createObject(this.config, this.data);
    }

    createObjectList() {
        return this.serviceObject.createObjectList(this.config, this.data);
    }

    updateObject() {
        return this.serviceObject.updateObject(this.config, this.data);
    }

    updateObjectList(){
        return this.serviceObject.updateObjectList(this.config, this.data);
    }

    partiallyUpdateObject() {
        return this.serviceObject.partiallyUpdateObject(this.config, this.data);
    }

    partiallyUpdateObjectList(){    
        return this.serviceObject.partiallyUpdateObjectList(this.config, this.data);
    }

    // deleteObject(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, query: any): Promise<any> {
    //     const [app_name, model_name] = this.parseConfig(config);
    //     return super.getData(this.getBaseUrl(), { app_name, model_name, __query__: JSON.stringify(query) });
    // }

    deleteObjectList() {
        return this.serviceObject.deleteObjectList(this.config, this.getQuery());
    }

}

