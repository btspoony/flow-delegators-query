import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

interface UserPoint {
    evm_address_id: string;
    keys: number;
    boxes: number;
    points: number;
}

interface Delegator {
    address: string;
    coa: string;
}

interface OutputAddress {
    address: string;
}

// Read and parse the CSV file
const userPointsPath = path.join(__dirname, '../inputs/user_points.csv');
const userPointsContent = fs.readFileSync(userPointsPath, 'utf-8');
const userPoints: UserPoint[] = parse(userPointsContent, {
    columns: true,
    skip_empty_lines: true
});

// Read and parse the JSON file
const delegatorsPath = path.join(__dirname, '../outputs/delegators_coa.json');
const delegators: Delegator[] = JSON.parse(fs.readFileSync(delegatorsPath, 'utf-8'));

// Filter valid addresses from userPoints (boxes, keys, or points >= 1000)
const validUserPoints = userPoints.filter(user =>
    (user.boxes && user.boxes >= 1000) ||
    (user.keys && user.keys >= 1000) ||
    (user.points && user.points >= 1000)
);

// Combine and deduplicate addresses
const allAddresses = new Set<string>();
for (const user of validUserPoints) {
    allAddresses.add(user.evm_address_id);
}
for (const delegator of delegators) {
    allAddresses.add(delegator.coa);
}

// Convert to output format
const outputAddresses: OutputAddress[] = Array.from(allAddresses).map(address => ({
    address
}));

// Create outputs directory if it doesn't exist
const outputsDir = path.join(__dirname, '../outputs');
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir);
}

// Write CSV output
const csvOutput = path.join(outputsDir, 'valid_addresses.csv');
fs.writeFileSync(csvOutput, `address\n${outputAddresses.map(item => item.address).join('\n')}`);

// Write JSON output
const jsonOutput = path.join(outputsDir, 'valid_addresses.json');
fs.writeFileSync(jsonOutput, JSON.stringify(outputAddresses, null, 2));

console.log(`Processed ${outputAddresses.length} unique addresses`);
console.log(`Output files created in ${outputsDir}:`);
console.log('- valid_addresses.csv');
console.log('- valid_addresses.json');
