import TonWeb from "tonweb";
import { Mnemonic } from 'ton3';
import { Wallets } from 'ton3-contracts';
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import fs from "fs";

if (!(String.prototype as any).replaceAll) {
	(String.prototype as any).replaceAll = function(str, newStr){

		// If a regex pattern
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}

		// If a string
		return this.replace(new RegExp(str, 'g'), newStr);

	};
}

function getMnemonic() {
    const mnemonic = fs.readFileSync("./mnemonic.txt", 'ascii');
    return mnemonic.split(" ");
}

async function getKeyPair() {
    const mnemonic = fs.readFileSync("./mnemonic.txt", 'ascii');
    return mnemonicToKeyPair(mnemonic.split(" "));
}

async function getWallet(tonweb: TonWeb) {
    const keyPair = await getKeyPair();
    return new tonweb.wallet.all.v3R2(tonweb.provider, {
        publicKey: keyPair.publicKey, wc: 0
    });
}

function getHighloadWallet() {
    const mnemonic = new Mnemonic(getMnemonic());
    return new Wallets.ContractHighloadWalletV2(0, mnemonic.keys.public)
}

function getDomains(): string[] {
    return (fs.readFileSync("./domains.txt", 'ascii') as any).replaceAll('\r', "").replaceAll(' ', "").split('\n')
}

function getProvider() {
    return new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
        apiKey: "0759c0449dbb10a49c53851e7f27ed2f216ca8b10226a018fe3f0530cc6e297a"
    });

    /*
    return new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
        apiKey: "74211e8d7b8ca24018b28989228223fd5ca2c1ece53e679c3d51af88c976c4e7"
    });   */
}

const collectionContentUri = "https://api.tonnames.org/nft/dns-vip-collection.json";
const nftItemContentBaseUri = "https://api.tonnames.org/nft/dns-vip-item-";

const Utils = {
    getKeyPair,
    getWallet,
    getDomains,
    getMnemonic,
    getHighloadWallet,
    getProvider,
    collectionContentUri,
    nftItemContentBaseUri
}

export { Utils }
