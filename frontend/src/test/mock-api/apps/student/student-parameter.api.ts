
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { STUDENT_APP } from '@urls/student.url';
import { STUDENT_PARAMETER_BASE_MODEL } from '@mock-data/apps/student/student-parameter.model';

export let STUDENT_PARAMETER_API = getApiStructure(STUDENT_APP.url + STUDENT_APP.model_url.student_parameter);

function getStudentParameterModelStructure(object): any {
    return getModelStructure(STUDENT_PARAMETER_BASE_MODEL, object);
}

// Version 1
STUDENT_PARAMETER_API.version_list.push(
    getVersionStructure(
        {[STUDENT_PARAMETER_API.url]: 1},
        [
            getStudentParameterModelStructure({
                id : 1,
                parentSchool: 1,
                name: 'Test 1',
            }),
            getStudentParameterModelStructure({
                id : 2,
                parentSchool: 1,
                name: 'Test 2',
                parameterType: 'FILTER',
                filterValues: '["Shujalpur","Akodia","Ashta","Kalapipal"]',
            })
        ]
    )
);
