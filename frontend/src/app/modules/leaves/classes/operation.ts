export interface Operation {
    operation: string; check: Function;
    data: Array<{ [key: string]: any }>; database: { [key: string]: string };
}