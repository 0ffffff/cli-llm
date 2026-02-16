import * as React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';
import { OneOff } from './src/cli/one-off.js';
import { Session } from './src/cli/session.js';
import { HistoryManager } from './src/history/manager.js';

const program = new Command();

// Alternate screen buffer helpers
function enterAltScreen() {
    process.stdout.write('\x1B[?1049h'); // Enter alternate buffer
    process.stdout.write('\x1B[H');       // Move cursor to top
    process.stdout.write('\x1B[2J');      // Clear screen
}

function exitAltScreen() {
    process.stdout.write('\x1B[?1049l'); // Exit alternate buffer
}

program
    .name('llm')
    .description('Premium CLI for AI chat — supports Kimi, ChatGPT, Claude, and more')
    .version('1.0.0')
    .option('-r, --resume <sessionId>', 'Resume a specific session by ID')
    .option('-s, --select', 'Interactively select a session to resume')
    .argument('[prompt...]', 'Immediate query text (one-off mode)')
    .action(async (promptParts: string[], options: { resume?: string; select?: boolean }) => {
        const prompt = promptParts.join(' ');
        const config = await ConfigManager.load();

        if (!config.apiKey) {
            render(<Onboarding />);
            return;
        }

        // One-off mode: no alternate screen needed
        if (prompt) {
            render(<OneOff prompt={prompt} config={config} />);
            return;
        }

        // Interactive session mode: use alternate screen
        enterAltScreen();

        let sessionId = options.resume;

        if (!sessionId) {
            const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const random = Math.random().toString(36).substring(2, 7);
            sessionId = `session-${date}-${random}`;
        }

        const instance = render(<Session config={config} sessionId={sessionId} />);
        await instance.waitUntilExit();
        exitAltScreen();
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
        sessions.forEach(id => console.log(`  - ${id}`));
        console.log('\nUse `llm --resume <id>` to continue a session.');
        console.log('Use `llm --select` for interactive selection.');
    });

process.on('SIGINT', () => {
    exitAltScreen();
    process.exit(0);
});

program.parseAsync(process.argv).catch(error => {
    exitAltScreen();
    console.error('Fatal Error:', error);
    process.exit(1);
});