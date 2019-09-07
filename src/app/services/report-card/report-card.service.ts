import {Injectable} from '@angular/core';


import {ServiceObject} from "../common/service-object";

@Injectable()
export class ReportCardService extends ServiceObject {

    protected module_url = '/report-card';

    //////////////////
    // For Mp Board //
    //////////////////

    private mp_board_url = '/mp-board';

    // objects urls
    public report_card_mapping = '/report_card_mapping';

    //////////////////
    // For CBSE //
    //////////////////

    private cbse_url = '/cbse';

    // objects urls
    // public report_card_mapping = '/report_card_mapping';

}
