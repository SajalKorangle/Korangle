
import { getApiStructure, getVersionStructure, getModelStructure } from '@mock-api/apps/common-functions';

import { STUDENT_APP } from '@urls/student.url';
import { STUDENT_SECTION_BASE_MODEL } from '@mock-data/apps/student/student-section.model';
import { STUDENT_API } from '@mock-api/apps/student/student.api';

export let STUDENT_SECTION_API = getApiStructure(STUDENT_APP.url + STUDENT_APP.model_url.student_section);

function getStudentSectionModelStructure(object): any {
    return getModelStructure(STUDENT_SECTION_BASE_MODEL, object);
}

// Version 1
STUDENT_SECTION_API.version_list.push(
    getVersionStructure(
        {
            [STUDENT_SECTION_API.url]: 1,
            [STUDENT_API.url]: 1,
        },
        [getStudentSectionModelStructure({
            id : 1,
            parentStudent : 1,
            parentClass : 7,
            parentDivision : 1,
            parentSession : 3,
            rollNumber : '1'
        }), getStudentSectionModelStructure({
            id : 2,
            parentStudent : 2,
            parentClass : 4,
            parentDivision : 1,
            parentSession : 3,
            rollNumber : '2'
        })]
    )
);
