import TonWeb from "tonweb";
import { Mnemonic, BOC, Address, Coins, Builder} from 'ton3';
import { DnsCollection } from "../contracts/dns-collection";
import { Utils } from "../utils/utils"

const tonwebProvider = Utils.getProvider();

(async () => {
    const domains = Utils.getDomains();
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
    
    const groupSize = 250;
    const grouped:string[][] = [];
    let group = [];
    for (const domain of domains) {
        group.push(domain);
        if (group.length == groupSize) {
            grouped.push(group);
            group = [];
        }
    }
    if (group.length > 0) {
        grouped.push(group);
    }

    for (const group of grouped) {
        const transfers = [];
        for (const domain of group) {
            transfers.push({
                destination: new Address(dnsCollectionContractAddress),
                amount: new Coins('0.080'),
                body: BOC.from(await (await dnsCollectionContract.createMintBody(domain, false)).toBoc())[0],
                mode: 1,
            })
        }
        const payments = wallet
            .createTransferMessage(transfers)
            .sign(mnemonic.keys.private)
        const paymentsBOC = BOC.toBase64Standard(payments);
        console.log();
        while (true) {
            try {
                const result = await tonwebProvider.sendBoc(paymentsBOC);
                console.log(`Group deploy success:`, group, result);
                break;
            } catch (e) {
                console.log(`Group deploy error.`, group, e, "Repeat.");
                await new Promise<void>(r => { setTimeout(() => r(), 5000) })
            }
        }
        console.log();
        await new Promise<void>(r => { setTimeout(() => r(), 5000) })
    }

    console.log("Finished");
})();
