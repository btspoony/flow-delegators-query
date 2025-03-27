import "EVM"

access(all) struct Info {
    access(all) let address: Address
    access(all) let coa: String

    init(
        address: Address,
        coa: String
    ) {
        self.address = address
        self.coa = coa
    }
}

access(all) fun main(addresses: [Address]): [Info] {
    let results: [Info] = []

    for address in addresses {
        if let coaAddress: EVM.EVMAddress = getAuthAccount<auth(BorrowValue) &Account>(address)
            .storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm)?.address() {
            results.append(Info(address: address, coa: coaAddress.toString()))
        }
    }
    return results
}