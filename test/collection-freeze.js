const {funcer} = require("./funcer");
const {
    makeStorageCollection, FC_COLLECTION, TON,  COLLECTION_ADDRESS, AUCTION_START_TIME, USER_ADDRESS, OWNER_ADDRESS,
} = require("./utils");

const storage = () => {
    return makeStorageCollection({});
}

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC_COLLECTION,
    'data': storage(),
    'in_msgs': [
        {
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                "uint32", 0x44beae41,
                "address", '0:' + USER_ADDRESS,
                "int1", -1
            ],
            "new_data": storage(),
            "exit_code": 405
        },
        {
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + OWNER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                "uint32", 0x44beae41,
                "address", '0:' + USER_ADDRESS,
                "int1", -1
            ],
            "new_data": storage(),
            "exit_code": 0,
        },
    ]
});

