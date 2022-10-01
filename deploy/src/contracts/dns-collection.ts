import TonWeb from "tonweb";
import { DictBuilder, Address, Builder, Cell, Slice } from "ton";
import { DnsItem, DNS_ITEM_CODE_HEX } from "./dns-item";

class TonWebCell extends TonWeb["boc"]["Cell"] {}

const DNS_COLLECTION_CODE_HEX = "B5EE9C7241021E0100038B000114FF00F4A413F4BCF2C80B0102016202030202CC040502012016170201200607020120121302012008090201200C0D02F7420C70094840FF2F0DE01D0D3030171B0925F03E0FA403001D31FED44D0FA40D4D4D4308210693D39505260BA8E2D375F0331D33F3002D0128210A8CB00AD708010C8CB055005CF1624FA0214CB6A13CB1FCB3F01CF16C98040FB00E025C000E3023724C0018E105B323301C705F2E195D307D43001FB00E024C00380A0B00335709F01D30701C00020B39402A60802DE12E63120C000F2D0C9800AE135F0332F823208210613F1310BCF2E0C701F00420D74920C200F2E0C8208100C0BBF2E0C92078A908C000F2E0CA21F005F2E0CB58F00714BEF2E0CC22F90170C85005CF16C971C8CB1F5004CF1613CC13CA00C912F00C00988E173404C705F2E195FA403003C85004CF1612CCCCCCC9ED54E0313522C0048E1A325213C705F2E19501D4D4304130C85004CF1612CCCCCCC9ED54E010245F048210370FEC51BADC840FF2F00201200E0F0201201011004F3223880875D244B5C61673C58875D2883000082CE6C070007CB83280B50C3400A44C78B98C72742000611C0875D26389972E882CE387CC00B4C1C8708BC8B04EAC08B09800F05EC4EC04AC6CC82CE500A98200B784F7B99B04AEA0005708300065CC2042EDE0404AF8083000A58C2040F9E018F8083000E58C20403E600678300124E00C5D781E9C600069006AC0BC018060840EE6B2802A0060840EE6B2802A00A084184FC4C428608209E3402A410830856456F81B04A5A9D6A0192A41392002015814150039D2CF8053810F805BBC00C646582AC678B387D0165B5E66664C0207D804002D007232FFFE0A33C5B25C083232C044FD003D0032C03260001B3E401D3232C084B281F2FFF2742002012018190201201C1D0057B8B5D31ED44D0FA40D4D4D43010235F03D0D431D430D071C8CB0701CF1601D0CF168B52E6A736F6E8CF16C980201201A1B002BB5DAFDA89A1F481A9A9A860D863A1A61FA61FF4806100029B4F47DA89A1F481A9A9A86026BE07E014E003E01700025B905BED44D0FA40D4D4D4305BD07F01D43058800F7BA30C21D74978A908C000F2E04621D70A07C00022D749C0085210B08E2F3031ED44D0FA40D4D4D43010235F03D0D431D431D30701C000F2E19CF4043021C000927832E08307F40F6FA1307801E031209501D3073101DE21F0035122D71830F9018200BA93C8CB0F01820167A3ED43D8CF16C90191789170E212A001842E519ED";

class DnsCollection extends TonWeb["Contract"] {
    constructor(provider, options) {
        options.code = TonWebCell.oneFromBoc(DNS_COLLECTION_CODE_HEX);
        super(provider, options);
    }

    public createDataCell(): any {
        const b = new Builder();
        b.storeAddress(Address.parse((this.options as any).ownerAddress));
        b.storeRef(this.createContentCell(this.options));
        b.storeRef(Cell.fromBoc(Buffer.from(DNS_ITEM_CODE_HEX, "hex"))[0]);
        b.storeRef(this.createRoyaltyCell());
        return TonWebCell.fromBoc(b.endCell().toBoc().toString("hex"))[0];
    }

    private createContentCell(params: any): Cell {
        const contentCell = new Builder();
        contentCell.storeRef(new Builder().storeUint(1, 8).storeBuffer(Buffer.from(params.collectionContentUri, "ascii")).endCell());
        contentCell.storeRef(new Builder().storeBuffer(Buffer.from(params.nftItemContentBaseUri, "ascii")).endCell());
        contentCell.storeUint(0, 9);
        return contentCell.endCell();
    }

    private createRoyaltyCell(): Cell {
        const royaltyCell = new Builder();
        royaltyCell.storeUint(40, 16);
        royaltyCell.storeUint(1000, 16);
        royaltyCell.storeAddress(Address.parse((this.options as any).ownerAddress));
        return royaltyCell.endCell();
    }

    public createAdminRequest(payload: Cell, mode: number): Cell {
        const b = new Builder();
        b.storeUint(1, 32);
        b.storeUint(mode, 8);
        b.storeRef(payload);
        return b.endCell();
    }

    public async createMintBody(domain: string): Promise<Cell> {
        const collectionAddress = Address.parse((await this.getAddress()).toString());
        const itemIndex = new Builder().storeBuffer(Buffer.from(domain, "ascii")).endCell().hash(); // await TonWeb.utils.sha256(Buffer.from(domain, "ascii"));
        const nftData = new Builder().storeBuffer(Buffer.from(itemIndex)).storeAddress(collectionAddress).endCell();
        const nftStateInit = new Builder()
            .storeUint(0, 2)
            .storeDict(Cell.fromBoc(Buffer.from(DNS_ITEM_CODE_HEX, "hex"))[0])
            .storeDict(nftData)
            .storeUint(0, 1)
            .endCell();

        const nftAddress = new Address(0, nftStateInit.hash());

        const body = new Builder()
            .storeUint(1, 32)
            .storeAddress(Address.parse((this.options as any).ownerAddress))
            .storeRef(new Builder().storeBuffer(Buffer.from(domain, "ascii")).endCell())
            .storeInt(-1, 1)
            .endCell();

        const b = new Builder();
        b.storeUint(0x18, 6);
        b.storeAddress(nftAddress);
        b.storeCoins(0);
        b.storeUint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1);
        b.storeRef(nftStateInit);   // state init
        b.storeRef(body);           // msg body

        return b.endCell();
        // return TonWebCell.fromBoc(b.endCell().toBoc().toString("hex"))[0];
    }
}

export { DnsCollection, DNS_COLLECTION_CODE_HEX }