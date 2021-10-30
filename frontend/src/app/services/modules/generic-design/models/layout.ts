export class Layout {

    id?: number;
    type: typeof TYPE_CHOICES[number];
    parentSchool: number;
    parentSchoolInstance?: {[key: string]: any};
    name: string;
    thumbnail: string;
    publiclyShared: boolean;
    content: { [key: string]: any; };

    constructor(attributes: Partial<Layout> = {}){
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }

};

export const TYPE_CHOICES = ['REPORT CARD', 'TC'] as const;

