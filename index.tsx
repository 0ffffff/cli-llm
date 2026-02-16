import * as React from 'react';
import { render } from 'ink';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';

async function main() {
    const config = await ConfigManager.load();

    if (!config.apiKey) {
        render(<Onboarding />);
        return;
    }

    // CLI Logic starts here once key is present
    console.log('Ready! Kimi k2.5 is at your service.');
    console.log('Use `llm` for interactive mode or `llm <prompt>` for immediate answers.');
}

main().catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
});