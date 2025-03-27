import { FlowConnector, type NetworkType } from "./flow";

import flowJSON from '../../flow.json' assert { type: "json" };

export const networkName = process.env.NETWORK || "testnet";

let connecter: FlowConnector;

export async function getFlowConnectorInstance(useSoftFinality = false) {
    if (!connecter) {
        connecter = new FlowConnector(flowJSON, networkName as NetworkType, useSoftFinality);
    }
    return connecter;
}
