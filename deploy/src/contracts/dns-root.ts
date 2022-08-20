import TonWeb from "tonweb";
import { DictBuilder, Address, Builder } from "ton";

class TonWebCell extends TonWeb["boc"]["Cell"] {}

const DNS_ROOT_CODE_HEX = "B5EE9C724101080100CA000114FF00F4A413F4BCF2C80B0102016202030202CD040500B9A1C6186041AE92F152118001E5C08C41AE140F800043AE938010A4216126B6F0DBC0412A03A60E6203BC43E00425AE306041F20203AE93DA89A1E80A25060FE81CDF436728BE06E0DBC10401752791961E039E2D920522F122E1C5400302012006070057648300065CC2042EDE0404AF8083000A58C2040F9E018F8083000E58C20403E600678300124E00C5D781E9C6000545F03800334709F01D30701C00020B39402A60802DE12E63120C000F2D0C98135DA895"

class DnsRoot extends TonWeb["Contract"] {
    private domainZones: {[key: string]: string} = {};

    constructor(provider, options) {
        options.code = TonWebCell.oneFromBoc(DNS_ROOT_CODE_HEX);
        super(provider, options);
        this.domainZones = options.domainZones;
    }

    public createDataCell(): any {
        const db = new DictBuilder(256);

        for (const domainZone in this.domainZones) {
            const domainZoneHash = (new Builder()).storeBuffer(Buffer.from(domainZone, "ascii")).endCell().hash();
            const domainZoneAddress = (new Builder().storeAddress(Address.parse(this.domainZones[domainZone]))).endCell();
            db.storeCell(domainZoneHash, domainZoneAddress);
        }

        const result = (new Builder()).storeDict(db.endCell()).endCell();
        return TonWebCell.fromBoc(result.toBoc().toString("hex"))[0];
    }
}

export { DnsRoot }