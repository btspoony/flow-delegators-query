import fs from 'node:fs';
import path from 'node:path';
import { getFlowAddressCOAs } from './utils/scripts';
import type { COAInfo } from './utils/types';

const BATCH_SIZE = 1000;
const INPUT_FILE = path.join(__dirname, '../inputs/delegators.json');
const OUTPUT_FILE = path.join(__dirname, '../outputs/delegators_coa.json');

async function processDelegators() {
    try {
        // Read input file
        const delegatorsData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8')) as string[];

        // Get unique addresses
        const uniqueAddresses = [...new Set(delegatorsData)];
        console.log(`Total unique addresses: ${uniqueAddresses.length}`);

        // Process addresses in batches
        const allCOAInfo: COAInfo[] = [];
        for (let i = 0; i < uniqueAddresses.length; i += BATCH_SIZE) {
            const batch = uniqueAddresses.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueAddresses.length / BATCH_SIZE)}`);

            const batchCOAInfo = await getFlowAddressCOAs(batch);
            allCOAInfo.push(...batchCOAInfo);

            // Add a small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (allCOAInfo.length === 0) {
            console.log('No COA information found');
            return;
        }

        // Create outputs directory if it doesn't exist
        const outputsDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputsDir)) {
            fs.mkdirSync(outputsDir, { recursive: true });
        }

        // Save results
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCOAInfo, null, 2));
        console.log(`Successfully processed ${allCOAInfo.length} addresses`);
        console.log(`Results saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error processing delegators:', error);
        process.exit(1);
    }
}

// Run the script
processDelegators();
