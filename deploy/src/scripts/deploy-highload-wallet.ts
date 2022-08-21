import TonWeb from "tonweb";
import { Mnemonic, BOC } from 'ton3';
import { Utils } from "../utils/utils";

const tonwebProvider = Utils.getProvider();

(async () => {
    const mnemonic = new Mnemonic(Utils.getMnemonic());
    
    const wallet = Utils.getHighloadWallet();
    const walletAddress = wallet.address.toString();

    console.log("Highload Wallet Contract Address is:", walletAddress);

    const deploy = wallet
        .createDeployMessage()
        .sign(mnemonic.keys.private);

    const deployBOC = BOC.toBase64Standard(deploy);

    const result = await tonwebProvider.sendBoc(deployBOC);
    console.log(result);
})();