const {funcer} = require("./funcer");
const {
    makeStorageCollection, FC_COLLECTION, TON, USER_ADDRESS, AUCTION_START_TIME, MONTH
} = require("./utils");

const storage = () => {
    return makeStorageCollection({});
}

const makeChars = (text, exitCode = 0) => {
    return [
        {
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                'uint32', 0,
                'string', text,
            ],
            "new_data": storage(),
            "exit_code": exitCode,
        },
    ]
}

const makeChars2 = (text1, text2, exitCode = 0) => {
    return [
        {
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                'uint32', 0,
                'string', text1,
                "cell", [
                    "string", text2
                ],
            ],
            "new_data": storage(),
            "exit_code": exitCode,
        },
    ]
}

const makePrice = (symbolsCount, addTime, price) => {
    let s = '';
    for (let i = 0; i < symbolsCount; i++) {
        s += 'a';
    }

    return [{
        "time": AUCTION_START_TIME + 1 + addTime,
        "sender": '0:' + USER_ADDRESS,
        "amount": price * TON,
        "body": [
            'uint32', 0,
            'string', s
        ],
        "new_data": storage(),
        "exit_code": 0,
    },
        {
            "time": AUCTION_START_TIME + 1 + addTime,
            "sender": '0:' + USER_ADDRESS,
            "amount": (price - 1) * TON,
            "body": [
                'uint32', 0,
                'string', s
            ],
            "new_data": storage(),
            "exit_code": 204
        }];
}

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC_COLLECTION,
    'data': storage(),
    'in_msgs': [
        { // auction not begin yet
            "time": AUCTION_START_TIME - 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                'uint32', 0,
                'string', "alice",
            ],
            "new_data": storage(),
            "exit_code": 199
        },
        { // mod(len, 8) == 0
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                'uint32', 0,
                'string', "alice",
                'uint1', 1
            ],
            "new_data": storage(),
            "exit_code": 202
        },
        { // invalid chars - \0 char
            "time": AUCTION_START_TIME + 1,
            "sender": '0:' + USER_ADDRESS,
            "amount": 1000 * TON,
            "body": [
                'uint32', 0,
                'bytes', new TextEncoder().encode("al\0ice"),
            ],
            "new_data": storage(),
            "exit_code": 203
        },
    ]
        // 0 chars
        .concat(makeChars('', 200))
        // 1 - 3 chars
        .concat(makeChars('a', 0))
        .concat(makeChars('yo', 0))
        .concat(makeChars('bob', 0))
        .concat(makeChars('bob', 0))

        // 127 chars alicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealicealiceal
        .concat(makeChars2('alicealicealicealicealicealicealicealicealiceali', 'cealicealicealicealicealicealicealicealicealicealicealicealicealicealicealiceal', 201))
        // 24 chars 
        .concat(makeChars('alicealicealicealicealic', 0))
        // 4 chars
        .concat(makeChars('appl', 0))
        // invalid chars
        .concat(makeChars('alicealicea$lice', 203))
        // invalid chars - hyphen
        .concat(makeChars('alice-', 203))
        .concat(makeChars('ali-ce', 203))
        .concat(makeChars('-alice', 203))
        // invalid chars - uppercase
        .concat(makeChars('aLice', 203))
        // valid chars
        .concat(makeChars('abcdefghijklmnopqrstuvwx', 0))


        // MIN PRICES
        .concat(makePrice(4, 0, 1000))
        .concat(makePrice(4, 1 * MONTH, Math.ceil(1000 * Math.pow(0.9, 1))))
        .concat(makePrice(4, 12 * MONTH, Math.ceil(1000 * Math.pow(0.9, 12))))
        .concat(makePrice(4, 24 * MONTH, 100))
        .concat(makePrice(5, 0, 500))
        .concat(makePrice(5, 6 * MONTH, Math.ceil(500 * Math.pow(0.9, 6))))
        .concat(makePrice(5, 24 * MONTH, 50))
        .concat(makePrice(6, 0, 400))
        .concat(makePrice(6, 24 * MONTH, 40))
        .concat(makePrice(7, 0, 300))
        .concat(makePrice(7, 24 * MONTH, 30))
        .concat(makePrice(8, 0, 200))
        .concat(makePrice(8, 24 * MONTH, 20))
        .concat(makePrice(9, 0, 100))
        .concat(makePrice(9, 24 * MONTH, 10))
        .concat(makePrice(10, 0, 50))
        .concat(makePrice(10, 24 * MONTH, 5))
        .concat(makePrice(11, 0, 10))
        .concat(makePrice(11, 24 * MONTH, 1))
        .concat(makePrice(12, 0, 10))
        .concat(makePrice(12, 24 * MONTH, 1))
});