import { Injector } from '@angular/core';
import { HttpClient, HttpHandler, HttpXhrBackend } from '@angular/common/http';
import { QUERY_INTERFACE, APP_MODEL_STRUCTURE_INTERFACE, FILTER_TYPE, GenericService } from './generic-service';

class QueryGeneratorMixin {

    query_data: QUERY_INTERFACE = {};

    getQuery() {
        return this.query_data;
    }

    filter(filter: FILTER_TYPE) {   // filter
        if (!this.query_data.filter) {
            this.query_data.filter = {};
        }
        Object.assign(this.query_data.filter, filter);
        return this;
    }

    exclude(filter: FILTER_TYPE) {  //  exclude
        if (!this.query_data.exclude) {
            this.query_data.exclude = {};
        }
        Object.assign(this.query_data.exclude, filter);
        return this;
    }

    setFields(...fields_list: Array<string>) {  // fields_list
        this.query_data.fields_list = fields_list;
        return this;
    }

    addParentQuery(name: string, parent_query: Query)  {    // parent_query
        if (!this.query_data.parent_query) {
            this.query_data.parent_query = {};
        }
        this.query_data.parent_query[name] = parent_query.getQuery();
        return this;
    }

    addChildQuery(name: string, child_query: Query) {   // child_query
        if (!this.query_data.child_query) {
            this.query_data.child_query = {};
        }
        this.query_data.child_query[name] = child_query.getQuery();
        return this;
    }

    union(...query_list: Array<Query>) {    // union
        if (!this.query_data.union) {
            this.query_data.union = [];
        }
        this.query_data.union.push(...query_list.map(q => q.getQuery()));
        return this;
    }

    annotate(key: string, field: string, function_name: string, filter?: FILTER_TYPE, exclude?: FILTER_TYPE) { // annotate
        if (!this.query_data.annotate) {
            this.query_data.annotate = {};
        }
        this.query_data.annotate[key] = { field, function: function_name };
        if (filter && exclude) {
            alert('Query is wrong, both filter and exclude shouldnt exist in annotate');
        }
        if (filter) {
            this.query_data.annotate[key].filter = filter;
        }
        if (exclude) {
            this.query_data.annotate[key].exclude = exclude;
        }
        return this;
    }

    orderBy(...fields_list: Array<string>) {    // order_by
        this.query_data.order_by = fields_list;
        return this;
    }

    paginate(start: number, end: number) {  // pagination
        this.query_data.pagination = { start, end };
        return this;
    }
}



const injector = Injector.create({
    providers: [
        { provide: GenericService, deps: [HttpClient] },
        { provide: HttpClient, deps: [HttpHandler] },
        { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) },
    ],
});

export class Query extends QueryGeneratorMixin {


    static serviceObject = injector.get(GenericService);

    getObject(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>) {
        return Query.serviceObject.getObject(app_model_name, this.getQuery());
    }

    getObjectList(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>) {
        return Query.serviceObject.getObjectList(app_model_name, this.getQuery());
    }

    createObject(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any) {
        return Query.serviceObject.createObject(app_model_name, data);
    }

    createObjectList(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: Array<any>) {
        return Query.serviceObject.createObjectList(app_model_name, data);
    }

    updateObject(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any) {
        return Query.serviceObject.updateObject(app_model_name, data);
    }

    updateObjectList(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: Array<any>) {
        return Query.serviceObject.updateObjectList(app_model_name, data);
    }

    partiallyUpdateObject(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: any) {
        return Query.serviceObject.partiallyUpdateObject(app_model_name, data);
    }

    partiallyUpdateObjectList(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data: Array<any>) {
        return Query.serviceObject.partiallyUpdateObjectList(app_model_name, data);
    }

    deleteObjectList(app_model_name: Partial<APP_MODEL_STRUCTURE_INTERFACE>, ) {
        return Query.serviceObject.deleteObjectList(app_model_name, this.getQuery());
    }

}

