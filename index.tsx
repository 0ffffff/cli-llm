import * as React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';
import { OneOff } from './src/cli/one-off.js';
import { Session } from './src/cli/session.js';
import { HistoryManager } from './src/history/manager.js';

const program = new Command();

program
    .name('llm')
    .description('Premium CLI for Kimi k2.5 on NVIDIA Cloud')
    .version('1.0.0')
    .option('-r, --resume <sessionId>', 'Resume a specific session')
    .argument('[prompt...]', 'Immediate query text')
    .action(async (promptParts: string[], options: { resume?: string }) => {
        const prompt = promptParts.join(' ');
        const config = await ConfigManager.load();

        if (!config.apiKey) {
            render(<Onboarding />);
            return;
        }

        if (prompt) {
            render(<OneOff prompt={prompt} config={config} />);
        } else {
            let sessionId = options.resume;

            if (!sessionId) {
                // Generate a new session ID if one isn't provided
                const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const random = Math.random().toString(36).substring(2, 7);
                sessionId = `session-${date}-${random}`;
            }

            render(<Session config={config} sessionId={sessionId} />);
        }
    });

program
    .command('list')
    .description('List recent chat sessions')
    .action(async () => {
        const sessions = await HistoryManager.listSessions();
        if (sessions.length === 0) {
            console.log('No recent sessions found.');
            return;
        }
        console.log('Recent sessions:');
        sessions.forEach(id => console.log(`- ${id}`));
        console.log('\nUse `llm --resume <id>` to continue a session.');
    });

process.on('SIGINT', () => {
    process.exit(0);
});

program.parseAsync(process.argv).catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
});