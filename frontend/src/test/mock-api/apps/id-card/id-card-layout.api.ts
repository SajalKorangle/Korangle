
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { ID_CARD_APP } from '@urls/id-card.url';
import { ID_CARD_LAYOUT_BASE_MODEL } from '@mock-data/apps/id-card/id-card-layout.model';

function getIdCardLayoutStructure(object: any): any {
    return getModelStructure(ID_CARD_LAYOUT_BASE_MODEL, object);
}

export let ID_CARD_LAYOUT_API = getApiStructure(ID_CARD_APP.url + ID_CARD_APP.model_url.id_card_layout);

// Version 1
ID_CARD_LAYOUT_API.version_list.push(
    getVersionStructure(
        {[ID_CARD_LAYOUT_API.url]: 1},
        [getIdCardLayoutStructure({
                id: 1,
                parentSchool: 1,
                name: 'Test Layout',
                content: '[]',
                backgroundImage: 'https://www.korangle.com/assets/img/plain-id-card.jpg',
            })]
    )
);
