
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICES_PATH = path.join(__dirname, '../data/services.json');

// Colors for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

interface Service {
    id: string;
    name: string;
    url: string;
    [key: string]: any;
}

async function checkUrl(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; KingstonCareConnect/1.0; +https://kingstoncare.vercel.app)'
            }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            return { ok: true, status: response.status };
        } else {
            // Some servers reject HEAD, try GET if HEAD fails with 405 or 403
            if (response.status === 405 || response.status === 403) {
                const controllerGet = new AbortController();
                const timeoutIdGet = setTimeout(() => controllerGet.abort(), 10000);
                const responseGet = await fetch(url, {
                    method: 'GET',
                    signal: controllerGet.signal,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; KingstonCareConnect/1.0; +https://kingstoncare.vercel.app)'
                    }
                });
                clearTimeout(timeoutIdGet);
                return { ok: responseGet.ok, status: responseGet.status };
            }

            return { ok: false, status: response.status };
        }
    } catch (error: any) {
        return { ok: false, error: error.message };
    }
}

async function main() {
    console.log(`${YELLOW}🔍 Starting Link Health Check...${RESET}\n`);

    const rawData = fs.readFileSync(SERVICES_PATH, 'utf-8');
    const services = JSON.parse(rawData) as Service[];

    let passed = 0;
    let failed = 0;

    // Process in chunks to avoid overwhelming network? 
    // For ~40 items it's fine to do sequential or small batch.
    // Let's do sequential for clarity and to not trigger rate limits.

    for (const service of services) {
        if (!service.url) {
            console.log(`${YELLOW}⚠️  [${service.name}] No URL provided${RESET}`);
            continue;
        }

        process.stdout.write(`Checking ${service.name} (${service.url})... `);

        const result = await checkUrl(service.url);

        if (result.ok) {
            console.log(`${GREEN}OK (${result.status})${RESET}`);
            passed++;
        } else {
            console.log(`${RED}FAIL${RESET}`);
            console.log(`   └─ Status: ${result.status || 'N/A'}`);
            console.log(`   └─ Error: ${result.error || 'None'}`);
            failed++;
        }
    }

    console.log(`\n${YELLOW}--- Report ---${RESET}`);
    console.log(`Total Services: ${services.length}`);
    console.log(`${GREEN}Passed: ${passed}${RESET}`);
    console.log(`${RED}Failed: ${failed}${RESET}`);

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

main().catch(console.error);
