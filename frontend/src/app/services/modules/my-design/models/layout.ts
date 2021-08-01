export class Layout {
    id?: number;
    type: typeof TYPE_CHOICES[number];
    parentSchool: number;
    name: string;
    thumbnail: string;
    publiclyShared: boolean;
    contentJSON: { [key: string]: any; };
};

export const TYPE_CHOICES = ['REPORT CARD', 'TC'] as const;

