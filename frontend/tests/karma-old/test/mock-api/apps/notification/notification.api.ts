
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { NOTIFICATION_APP } from '@urls/notification.url';
import { NOTIFICATION_BASE_MODEL } from '@mock-data/apps/notification/notification.model';

function getNotificationStructure(object: any): any {
    return getModelStructure(NOTIFICATION_BASE_MODEL, object);
}

export let NOTIFICATION_API = getApiStructure(NOTIFICATION_APP.url + NOTIFICATION_APP.model_url.notification);

// Version 1
NOTIFICATION_API.version_list.push(
    getVersionStructure(
        {[NOTIFICATION_API.url]: 1},
        [
            getNotificationStructure({
                id: 1,
                content: 'Testing',
                parentMessageType: 1,
                parentUser: 1,
                parentSchool: 1
            }),
            getNotificationStructure({
                id: 2,
                content: 'Testing - 2',
                parentMessageType: 1,
                parentUser: 1,
                parentSchool: 1
            }),
            getNotificationStructure({
                id: 3,
                content: 'Testing - 3',
                parentMessageType: 1,
                parentUser: 1,
                parentSchool: 1
            }),
        ]
    )
);
