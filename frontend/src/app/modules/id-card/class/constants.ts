export const FIELDS = [
    {
        key: 'name',
        type: 'text',
        name: 'Name',
        get: (data, id) => data.studentList.find(x => x.id===id).name
    },
    {
        key: 'fathersName',
        type: 'text',
        name: `Father's Name`,
        get: (data, id) => data.studentList.find(x => x.id===id).fathersName
    },
    {
        key: 'class',
        type: 'text',
        name: 'Class',
        get: (data, id) => data.classList.find(cl => cl.id===data.studentSectionList.find(x => x.parentStudent===id).parentClass).name
    },
    {
        key: 'section',
        type: 'text',
        name: 'Section',
        get: (data, id) => data.divisionList.find(div => div.id===data.studentSectionList.find(x => x.parentStudent===id).parentDivision).name
    },
    {
        key: 'classSection',
        type: 'text',
        name: 'Class & Section',
        get: (data, id) => `${data.classList.find(cl => cl.id===data.studentSectionList.find(x => x.parentStudent===id).parentClass).name}, ${data.divisionList.find(div => div.id===data.studentSectionList.find(x => x.parentStudent===id).parentDivision).name}`
    },
    {
        key: 'mothersName',
        type: 'text',
        name: `Mother's Name`,
        get: (data, id) => data.studentList.find(x => x.id===id).motherName
    },
    {
        key: 'mobileNumber',
        type: 'text',
        name: 'Mobile',
        get: (data, id) => data.studentList.find(x => x.id===id).mobileNumber
    },
    {
        key: 'scholarNumber',
        type: 'text',
        name: 'Scholar No.',
        get: (data, id) => data.studentList.find(x => x.id===id).scholarNumber
    },
    {
        key: 'rollNumber',
        type: 'text',
        name: 'Roll No.',
        get: (data, id) => data.studentSectionList.find(x => x.parentStudent===id).rollNumber
    },
    {
        key: 'address',
        type: 'text',
        name: 'Address',
        get: (data, id) => data.studentList.find(x => x.id===id).address
    },
    {
        key: 'logo',
        type: 'image',
        name: 'School Logo',
        get: (data, id) => data.user.activeSchool.profileImage
    },
    {
        key: 'profile',
        type: 'image',
        name: 'Profile Image',
        get: (data, id) => data.studentList.find(x => x.id===id).profileImage
    }
    
]