class SendUpdateTypeStructure {
    static getStructure(id: number, name: string) {
        return {
            id: id,
            name: name,
        };
    }
}

export const SEND_UPDATE_TYPE_LIST = [
    SendUpdateTypeStructure.getStructure(1, 'NULL'),
    SendUpdateTypeStructure.getStructure(2, 'SMS'),
    SendUpdateTypeStructure.getStructure(3, 'NOTIFICATION'),
    SendUpdateTypeStructure.getStructure(4, 'NOTIF./SMS')
];
