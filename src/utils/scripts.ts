import type { COAInfo } from './types';
import { getFlowConnectorInstance } from './singletons';
import getCOAAddresses from '../cadence/scripts/get_addresses_coa.cdc?raw';

export async function getAddresses(list: string[]): Promise<COAInfo[]> {
    const connecter = await getFlowConnectorInstance(true);
    return await connecter.executeScript(getCOAAddresses, (arg, t) => [
        arg(list, t.Array(t.String))
    ], [] as COAInfo[])
}