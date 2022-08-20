import TonWeb from "tonweb";
import { Mnemonic, BOC, Address, Coins, Builder} from 'ton3';
import { DnsCollection } from "../contracts/dns-collection";
import { Utils } from "../utils/utils"

const tonwebProvider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: Utils.getApiKey()
});

(async () => {
    const mnemonic = new Mnemonic(Utils.getMnemonic());
    
    const wallet = Utils.getHighloadWallet();
    const walletAddress = wallet.address.toString();

    const dnsCollectionContract = new DnsCollection(tonwebProvider, {
        infoUrl: Utils.getDnsCollectionInfo(),
        ownerAddress: walletAddress
    })
    const dnsCollectionContractAddress = (await dnsCollectionContract.getAddress()).toString(true, true, false, false);

    console.log("Wallet Contract Address is:", walletAddress);
    console.log("DNS Collection Address is: ", dnsCollectionContractAddress);

    const transfers = [{
        destination: new Address(dnsCollectionContractAddress),
        amount: new Coins('0.075'),
        body: new Builder().cell(),
        mode: 3,
        init: BOC.from(await (await dnsCollectionContract.createStateInit()).stateInit.toBoc(false))[0]
    }]

    const payments = wallet
        .createTransferMessage(transfers)
        .sign(mnemonic.keys.private)
    const paymentsBOC = BOC.toBase64Standard(payments);
    
    const result = await tonwebProvider.sendBoc(paymentsBOC);
    console.log(result);
})();
