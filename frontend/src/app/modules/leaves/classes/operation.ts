export interface Operation {
    operation: string;
    check: Function;
    data: { [id: string]: any };
    database: { [id: string]: string };
}