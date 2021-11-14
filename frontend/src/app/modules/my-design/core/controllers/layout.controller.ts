import { LAYOUT_INTERFACE } from '../constant';

export class LayoutController {

    layout: LAYOUT_INTERFACE = null;

    layoutParserMiddleware: Array<LAYOUT_PARSER_MIDDLEWARE>= [];

    constructor() { }

    parseAndSetLayout(rawLayout: {[key: string]: any}): void {
        let finalLayout: any = {};
        this.layoutParserMiddleware.forEach(middleware => {
            finalLayout = middleware(rawLayout, finalLayout);
        });
        this.layout = finalLayout;
    }



}


type LAYOUT_PARSER_MIDDLEWARE = (rawLayout: {[key: string]: any}, semiProcessedLayout: Partial<LAYOUT_INTERFACE>) => Partial<LAYOUT_INTERFACE>;