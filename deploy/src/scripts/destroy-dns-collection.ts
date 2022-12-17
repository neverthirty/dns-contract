import { Mnemonic, BOC, Address, Coins, Builder} from 'ton3';
import { DnsCollection } from "../contracts/dns-collection";
import { Utils } from "../utils/utils"

const tonwebProvider = Utils.getProvider();
const collectionAddresToDestroy = new Address("EQBGhxsiJRYFlEGZ24BEkJ8pbQfUFC9GeYBSxC5cO0wcXX1H");


(async () => {
    const wallet = Utils.getHighloadWallet();
    const mnemonic = new Mnemonic(Utils.getMnemonic());

    // (wallet as any)._address = new Address("EQDIGWBz_t0TaD1i1PIfxpVztdVo_ElQlHLIkYrrNGz2wZ9i");

    const walletAddress = wallet.address.toString();
    const dnsCollectionContract = new DnsCollection(tonwebProvider, {   
        collectionContentUri: "",
        nftItemContentBaseUri: "",
        ownerAddress: walletAddress
    })

    
    const transfers = [];

    console.log("Wallet Contract Address is:", walletAddress);

    
    const destroyBody = await dnsCollectionContract.createDestroyCollectionBody(walletAddress);
    const requestBody = dnsCollectionContract.createAdminRequest(destroyBody, 128 + 32);

    transfers.push({
        destination: collectionAddresToDestroy,
        amount: new Coins('0.05'),
        body: BOC.from(requestBody.toBoc().toString("hex"))[0],
        mode: 1,
    })

    const payments = wallet
        .createTransferMessage(transfers)
        .sign(mnemonic.keys.private)
    const paymentsBOC = BOC.toBase64Standard(payments);
    const result = await tonwebProvider.sendBoc(paymentsBOC);



    console.log("Finished", result);
})();