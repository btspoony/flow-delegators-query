import "FlowIDTableStaking"

access(all) struct ValidDelegatorInfo {
    access(all) let delegatorID: UInt32
    access(all) let tokensStaked: UFix64
    access(all) let tokensUnstaking: UFix64

    init(
        delegatorID: UInt32,
        tokensStaked: UFix64,
        tokensUnstaking: UFix64
    ) {
        self.delegatorID = delegatorID
        self.tokensStaked = tokensStaked
        self.tokensUnstaking = tokensUnstaking
    }
}

access(all) fun main(nodeID: String, validStaked: UFix64): [ValidDelegatorInfo] {
    let nodeInfo = FlowIDTableStaking.NodeInfo(nodeID: nodeID)

    let delegators = nodeInfo.delegators

    let validInfo: [ValidDelegatorInfo] = []

    for delegatorID in delegators {
        let delInfo = FlowIDTableStaking.DelegatorInfo(nodeID: nodeID, delegatorID: delegatorID)

        if delInfo.tokensStaked - delInfo.tokensUnstaking >= validStaked {

            let info = ValidDelegatorInfo(
                delegatorID: delegatorID,
                tokensStaked: delInfo.tokensStaked,
                tokensUnstaking: delInfo.tokensUnstaking
            )
            validInfo.append(info)
        }
    }

    return validInfo
}