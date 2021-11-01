import { Injector } from '@angular/core';
import { HttpClient, HttpHandler, HttpXhrBackend } from '@angular/common/http';
import { QUERY_INTERFACE, APP_MODEL_STRUCTURE_INTERFACE, FILTER_TYPE, GenericService } from './generic-service';

const injector = Injector.create({
    providers: [
        { provide: GenericService, deps: [HttpClient] },
        { provide: HttpClient, deps: [HttpHandler] },
        { provide: HttpHandler, useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest }) },
    ],
});

class QueryGeneratorMixin {

    data: any;
    query_data: QUERY_INTERFACE = {};

    constructor(data?: any) {
        this.data = data;
    }

    getQuery() {
        return this.query_data;
    }

    filter(filter: FILTER_TYPE) {
        if (!this.query_data.filter) {
            this.query_data.filter = {};
        }
        Object.assign(this.query_data.filter, filter);
        return this;
    }

    exclude(filter: FILTER_TYPE) {
        if (!this.query_data.exclude) {
            this.query_data.exclude = {};
        }
        Object.assign(this.query_data.exclude, filter);
        return this;
    }

    setFields(...fields_list: Array<string>) {
        this.query_data.fields_list = fields_list;
        return this;
    }

    addParentQuery(name: string, parent_query: Query) {
        if (!this.query_data.parent_query) {
            this.query_data.parent_query = {};
        }
        this.query_data.parent_query[name] = parent_query.getQuery();
        return this;
    }

    addChildQuery(name: string, child_query: Query) {
        if (!this.query_data.child_query) {
            this.query_data.parent_query = {};
        }
        this.query_data.child_query[name] = child_query.getQuery();
        return this;
    }

    union(...query_list: Array<Query>) {
        if (!this.query_data.union) {
            this.query_data.union = [];
        }
        this.query_data.union.push(...query_list.map(q => q.getQuery()));
        return this;
    }

    annotate(key: string, field: string, function_name: string, filter?: FILTER_TYPE) {
        if (!this.query_data.annotate) {
            this.query_data.annotate = {};
        }
        this.query_data.annotate[key] = { field, function: function_name };
        if (filter) {
            this.query_data.annotate[key].filter = filter;
        }
        return this;
    }

    orderBy(...fields_list: Array<string>) {
        this.query_data.order_by = fields_list;
        return this;
    }

    paginate(start: number, end: number) {
        this.query_data.pagination = { start, end };
        return this;
    }
};

export class Query extends QueryGeneratorMixin {

    config: Partial<APP_MODEL_STRUCTURE_INTERFACE>;

    static serviceObject = injector.get(GenericService);

    constructor(config: Partial<APP_MODEL_STRUCTURE_INTERFACE>, data?: any) {
        super(data);
        this.config = config;
    }

    getObject() {
        return Query.serviceObject.getObject(this.config, this.getQuery());
    }

    getObjectList() {
        return Query.serviceObject.getObjectList(this.config, this.getQuery());
    }

    createObject() {
        return Query.serviceObject.createObject(this.config, this.data);
    }

    createObjectList() {
        return Query.serviceObject.createObjectList(this.config, this.data);
    }

    updateObject() {
        return Query.serviceObject.updateObject(this.config, this.data);
    }

    updateObjectList() {
        return Query.serviceObject.updateObjectList(this.config, this.data);
    }

    partiallyUpdateObject() {
        return Query.serviceObject.partiallyUpdateObject(this.config, this.data);
    }

    partiallyUpdateObjectList() {
        return Query.serviceObject.partiallyUpdateObjectList(this.config, this.data);
    }

    deleteObjectList() {
        return Query.serviceObject.deleteObjectList(this.config, this.getQuery());
    }

}

