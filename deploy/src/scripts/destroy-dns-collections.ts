import TonWeb from "tonweb";
import { Mnemonic, BOC, Address, Coins, Builder} from 'ton3';
import { DnsCollection } from "../contracts/dns-collection";
import { Utils } from "../utils/utils"
import fs from "fs";

const tonwebProvider = Utils.getProvider();

(async () => {
    const mnemonic = new Mnemonic(Utils.getMnemonic());

    const wallet = Utils.getHighloadWallet();
    const walletAddress = wallet.address.toString();
    const collectionAddressList = readCollectionAddresses();

    console.log("Wallet Contract Address is:", walletAddress);
    console.log("DNS Collection Addresses: ", collectionAddressList);

    const transfers = readCollectionAddresses().map((address) => ({
        destination: new Address(address),
        amount: new Coins('0.1'),
        body: new Builder().cell(),
        mode: 128 + 32,
    }));

    const payments = wallet
        .createTransferMessage(transfers)
        .sign(mnemonic.keys.private);
    const paymentsBOC = BOC.toBase64Standard(payments);

    const result = await tonwebProvider.sendBoc(paymentsBOC);
    console.log(result);
})();

function readCollectionAddresses(): string[] {
  return (fs.readFileSync("./collections.txt", 'ascii') as any)
      .replaceAll('\r', '')
      .trim()
      .split('\n');
}
