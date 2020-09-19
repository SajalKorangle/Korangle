
export class DataStorage {

    static dataStorage: DataStorage;

    user: any;

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

}
