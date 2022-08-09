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
    makeStorageItem, AUCTION_START_TIME
} = require("./utils");

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC_ITEM,
    'data': makeStorageItemComplete({}),
    "configParams": {
        81: [
            'cell', [
                "uint256->cell", {
                    '38930916800118655128984401856443062677799436388671332167772672007419684920584': [
                        'uint8', 1
                    ]
                }
            ]
        ]
    },
    'in_msgs': [
        {
            "time": AUCTION_START_TIME,
            "sender": '0:' + USER_ADDRESS,
            "contract_balance": 1000 * TON,
            "amount": 1 * TON,
            "body": [
                "uint32", 0x44beae41,
                "uint64", 123,
            ],
            "new_data": makeStorageItemComplete({}),
            "out_msgs": [
                {
                    "type": "Internal",
                    "to": "0:" + COLLECTION_ADDRESS,
                    "amount": 0,
                    "sendMode": 128 + 32,
                    "body": [
                        "uint32", 0x370fec51, // op
                        "uint64", 123, // query_id
                    ],
                },
            ]
        },
        ]
});

