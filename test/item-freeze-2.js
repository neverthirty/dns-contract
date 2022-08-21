const {funcer} = require("./funcer");
const {
    makeStorageItemNonInit,
    FC_COLLECTION,
    DNS_NEXT_RESOLVER_PREFIX,
    AUCTION_START_DURATION,
    TON,
    COLLECTION_ADDRESS,
    OWNER_ADDRESS,
    USER_ADDRESS,
    YEAR,
    FC_ITEM,
    makeStorageItemComplete,
    makeStorageItemCompleteFrozen,
    makeStorageItem, AUCTION_START_TIME
} = require("./utils");

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC_ITEM,
    'data': makeStorageItemCompleteFrozen({}),
    'in_msgs': [
        {
            "time": AUCTION_START_TIME,
            "sender": '0:' + COLLECTION_ADDRESS,
            "contract_balance": 1000 * TON,
            "amount": 1 * TON,
            "body": [
                "uint32", 0x44beae41,
                "uint64", 123,
                "int1", 0,
            ],
            "new_data": makeStorageItemComplete({}),
        },
    ]
});