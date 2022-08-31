rm build/nft-item-code.fif
rm build/nft-collection-code.fif

func -o build/nft-item-code.fif -SPA stdlib.fc params.fc op-codes.fc dns-utils.fc nft-item.fc
func -o build/nft-collection-code.fif -SPA stdlib.fc params.fc op-codes.fc dns-utils.fc nft-collection.fc

fift -s build/print-hex.fif
