import * as React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';
import { OneOff } from './src/cli/one-off.js';
import { Session } from './src/cli/session.js';

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
            render(<OneOff prompt={prompt} config={config} />);
        } else {
            render(<Session config={config} />);
        }
    });

process.on('SIGINT', () => {
    process.exit(0);
});

program.parseAsync(process.argv).catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
});