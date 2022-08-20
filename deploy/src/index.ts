import TonWeb from "tonweb";

const tonwebProvider = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: '74211e8d7b8ca24018b28989228223fd5ca2c1ece53e679c3d51af88c976c4e7'});
// const tonwebProvider = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '0759c0449dbb10a49c53851e7f27ed2f216ca8b10226a018fe3f0530cc6e297a'});
const tonweb: any = new TonWeb(tonwebProvider);

function patchTonweb(tonweb, address) {
    const context = tonweb.dns;
    tonweb.dns.getRootDnsAddress = (async () => {
        return new TonWeb.Address(address);
    });
}

patchTonweb(tonweb, "UQDA7KCsgtI9RK8CcIalFCRXqsbZKNETyXP2eaCisYBX7DkV");

(async () => {
    const addr = await tonweb.dns.getRootDnsAddress();
    console.log(addr.toString(true));
    console.log();

    await tonweb.dns.resolve("dubai.ton", "dns_next_resolver", true).then(r => {
        console.log("result", r.toString(true));
    }, e => {
        console.log("error", e);
    });
    
    await tonweb.dns.resolve("tonnames2.vip", "dns_next_resolver", true).then(r => {
        console.log("result", r.toString(true));
    }, e => {
        console.log("error", e);
    });

    await tonweb.dns.resolve("dubai.cum", "dns_next_resolver", true).then(r => {
        console.log("result", r);
    }, e => {
        console.log("error", e);
    });

    patchTonweb(tonweb, "UQBa7Zrl2Gm8C8fOuLA/AHB0yfdVXrOiCMW74UGV/Ibehc7u");

    await tonweb.dns.resolve("tonnames2", "dns_next_resolver", true).then(r => {
        console.log("result", r.toString(true));
    }, e => {
        console.log("error", e);
    });

})();