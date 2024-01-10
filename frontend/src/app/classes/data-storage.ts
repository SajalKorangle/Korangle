export class FeatureFlag {
    name: string;
    enabled: boolean;
}
export class DataStorage {
    static dataStorage: DataStorage;

    user: any;
    featureFlaglist: FeatureFlag[];

    static getInstance(): DataStorage {
        if (!DataStorage.dataStorage) {
            DataStorage.dataStorage = new DataStorage();
        }
        return DataStorage.dataStorage;
    }

    constructor() {}

    getUser(): any {
        return this.user;
    }

    setUser(user: any): any {
        this.user = user;
    }

    setFeatureFlagList(featureFlagList: FeatureFlag[]) {
        this.featureFlaglist = featureFlagList;
    }

    isFeatureEnabled(featureName: string): boolean {
        return this.featureFlaglist.find((featureFlag: FeatureFlag) => {
            return featureFlag.name == featureName;
        }).enabled;
    }
}
