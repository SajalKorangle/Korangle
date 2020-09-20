
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { STUDENT_APP } from '@urls/student.url';
import { STUDENT_PARAMETER_VALUE_BASE_MODEL } from '@mock-data/apps/student/student-parameter-value.model';
import { STUDENT_PARAMETER_API } from '@mock-api/apps/student/student-parameter.api';
import { STUDENT_API } from '@mock-api/apps/student/student.api';

export let STUDENT_PARAMETER_VALUE_API = getApiStructure(STUDENT_APP.url + STUDENT_APP.model_url.student_parameter_value);

function getStudentParameterValueModelStructure(object): any {
    return getModelStructure(STUDENT_PARAMETER_VALUE_BASE_MODEL, object);
}

// Version 1
STUDENT_PARAMETER_VALUE_API.version_list.push(
    getVersionStructure(
        {
            [STUDENT_PARAMETER_VALUE_API.url]: 1,
            [STUDENT_PARAMETER_API.url]: 1,
            [STUDENT_API.url]: 1,
        },
        [
            getStudentParameterValueModelStructure({
                id : 1,
                parentStudent: 1,
                parentStudentParameter: 1,
                value: 'Test Value 1'
            }),
            getStudentParameterValueModelStructure({
                id : 2,
                parentStudent: 2,
                parentStudentParameter: 1,
                value: 'Test Value 2'
            })
        ]
    )
);
