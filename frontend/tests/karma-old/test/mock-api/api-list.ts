
import { ID_CARD_LAYOUT_API } from '@mock-api/apps/id-card/id-card-layout.api';
import { STUDENT_API } from '@mock-api/apps/student/student.api';
import {STUDENT_SECTION_API} from '@mock-api/apps/student/student-section.api';
import {STUDENT_PARAMETER_API} from '@mock-api/apps/student/student-parameter.api';
import {STUDENT_PARAMETER_VALUE_API} from '@mock-api/apps/student/student-parameter-value.api';
import {NOTIFICATION_API} from '@mock-api/apps/notification/notification.api';

export const API_LIST = [

    // Student App
    STUDENT_API,
    STUDENT_SECTION_API,
    STUDENT_PARAMETER_API,
    STUDENT_PARAMETER_VALUE_API,

    // Id Card App
    ID_CARD_LAYOUT_API,

    // Notification App
    NOTIFICATION_API,

];
