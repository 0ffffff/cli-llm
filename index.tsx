import * as React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';
import { OneOff } from './src/cli/one-off.js';

const program = new Command();

program
    .name('llm')
    .description('Premium CLI for Kimi k2.5 on NVIDIA Cloud')
    .version('1.0.0')
    .argument('[prompt...]', 'Immediate query text')
    .action(async (promptParts: string[]) => {
        const prompt = promptParts.join(' ');
        const config = await ConfigManager.load();

        if (!config.apiKey) {
            render(<Onboarding />);
            return;
        }

        if (prompt) {
            // One-off Mode
            render(<OneOff prompt={prompt} config={config} />);
        } else {
            // Interactive Mode (Session persistence coming in Phase 4)
            console.log('Ready! Kimi k2.5 is at your service.');
            console.log('Interactive session mode placeholder - entering session...');
            // Placeholder: In Phase 3/4 we'll render a <Session /> component
            process.exit(0);
        }
    });

// Handle Ctrl-C gracefully
process.on('SIGINT', () => {
    process.exit(0);
});

program.parseAsync(process.argv).catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
});