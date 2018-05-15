
export class DataStorage {

    static dataStorage: DataStorage;

    user: any;

    constructor() {}

    static getInstance(): DataStorage {
        if (!DataStorage.dataStorage) {
            DataStorage.dataStorage = new DataStorage();
        }
        return DataStorage.dataStorage;
    }

    getUser(): any {
        return this.user;
    }

    setUser(user: any): any {
        this.user = user;
    }

}