export type Session = {
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    orderNumber: number
};

export type Class = {
    id: number,
    name: string,
    orderNumber: number
};

export type Section = {
    id: number,
    name: string,
    orderNumber: number
};

export type ClassSectionSession = {
    class: Class,
    section: Section,
    session: Session
};

export type Student = {
    id: number,
    name: string,
    admissionSession: number,
    dateOfAdmission: Date,
    allowedAdmissionSessionList: Session[],
    // Order is from newest session to oldest session.
    classSectionSessionList: ClassSectionSession [],
    currentClassSectionSession: ClassSectionSession,
    potentialAdmissionSession: Session
};

export type StudentAndStudentSectionJoined = {
    id: number,
    parentSession: number
    parentClass: number,
    parentDivision: number,
    parentStudent: number,
    parentStudent__name: string,
    parentStudent__dateOfAdmission: Date,
    parentStudent__admissionSession: number,
};
