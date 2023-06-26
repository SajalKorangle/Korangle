import { APP_MODEL_STRUCTURE_INTERFACE } from "@services/generic/generic-service";

export interface Operation {
    operation: string; check: Function;
    data: Array<{ [key: string]: any }>; database: Partial<APP_MODEL_STRUCTURE_INTERFACE>;
}