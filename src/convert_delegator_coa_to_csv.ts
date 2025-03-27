import fs from 'node:fs';
import path from 'node:path';

interface DelegatorCoa {
    address: string;
    coa: string;
}

async function convertJsonToCsv() {
    try {
        const jsonPath = path.join(__dirname, '../outputs/delegators_coa.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as DelegatorCoa[];

        const csvHeader = 'Flow Address,COA address(EVM)\n';
        const csvRows = jsonData.map(item => `${item.address},${item.coa}`).join('\n');
        const csvContent = csvHeader + csvRows;

        const csvPath = path.join(__dirname, '../outputs/delegators_coa.csv');
        fs.writeFileSync(csvPath, csvContent);

        console.log(`Successfully converted JSON to CSV. Output saved to: ${csvPath}`);
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
        process.exit(1);
    }
}

// Run the script
convertJsonToCsv();
