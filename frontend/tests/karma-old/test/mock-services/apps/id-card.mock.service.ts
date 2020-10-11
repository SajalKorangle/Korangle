import {Injectable} from '@angular/core';

import { MockServiceObject } from '@mock-services/common/mock-service-object';
import { ID_CARD_APP } from '@urls/id-card.url';


@Injectable()
export class IdCardMockService extends MockServiceObject {

    public app_url = ID_CARD_APP.url;

    // object urls
    public id_card_layout = ID_CARD_APP.model_url.id_card_layout;

}
