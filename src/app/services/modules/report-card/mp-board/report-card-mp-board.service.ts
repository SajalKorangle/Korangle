import {Injectable} from '@angular/core';


import {ReportCardService} from "../report-card.service";

@Injectable()
export class ReportCardMpBoardService extends ReportCardService {

    private mp_board_url = '/mp-board';

    // objects urls
    public report_card_mapping = this.mp_board_url+'/report-card-mapping';

}
