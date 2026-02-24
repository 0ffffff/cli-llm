import * as React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import * as readline from 'readline';
import { ConfigManager } from './src/config/manager.js';
import { Onboarding } from './src/cli/onboarding.js';
import { OneOff } from './src/cli/one-off.js';
import { Session } from './src/cli/session.js';
import { SessionPicker } from './src/cli/SessionPicker.js';
import { HistoryManager } from './src/history/manager.js';
import { ModelPicker } from './src/cli/ModelPicker.js';

const program = new Command();

// On any CLI invocation, attempt to load the config once up front.
// This ensures that a malformed local config file is automatically
// repaired (reset to a functioning default) the next time any `llm`
// command is run, without triggering interactive onboarding.
void ConfigManager.load().catch(error => {
    console.error('Non-fatal error while preloading configuration:', error);
});

// Alternate screen buffer helpers
function enterAltScreen() {
    process.stdout.write('\x1B[?1049h'); // Enter alt screen
    process.stdout.write('\x1B[?1000h'); // Enable mouse tracking
    process.stdout.write('\x1B[?1006h'); // Enable SGR mode
    process.stdout.write('\x1B[H');
    process.stdout.write('\x1B[2J');
}

function exitAltScreen() {
    process.stdout.write('\x1B[?1006l'); // Disable SGR mode
    process.stdout.write('\x1B[?1000l'); // Disable mouse tracking
    process.stdout.write('\x1B[?1049l'); // Exit alt screen
    process.stdout.write('\x1B[?25h');   // Ensure cursor is shown
}

// Direct session (new or resumed)

function generateSessionId(): string {
    const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const random = Math.random().toString(36).substring(2, 7);
    return `session-${date}-${random}`;
}

program
    .name('llm')
    .description('CLI for AI chat — works with your configured endpoint and model')
    .version('1.0.0')
    .option('-r, --resume <sessionId>', 'Resume a specific session by ID')
    .option('-s, --select', 'Interactively select a session to resume')
    .option('-m, --model', 'Interactively select provider/model')
    .argument('[prompt...]', 'Immediate query text (one-off mode)')
    .action(async (promptParts: string[], options: { resume?: string; select?: boolean; model?: boolean }) => {
        const prompt = promptParts.join(' ');
        let config = await ConfigManager.load();

        const normalizedProvider = (config.provider || 'nim').trim().toLowerCase();
        const missing: Array<'apiKey' | 'baseUrl'> = [];
        if (!config.apiKeys?.[normalizedProvider]?.trim()) missing.push('apiKey');
        if (!config.baseUrl || !config.baseUrl.trim()) missing.push('baseUrl');

        if (missing.length > 0 && !options.model) {
            enterAltScreen();
            const instance = render(<Onboarding missing={missing} />);
            await instance.waitUntilExit();
            exitAltScreen();

            // Re-load and continue in the same invocation if configured
            config = await ConfigManager.load();
            const providerAfter = (config.provider || 'nim').trim().toLowerCase();
            if (!config.apiKeys?.[providerAfter]?.trim() || !config.baseUrl?.trim()) {
                return;
            }
        }

        // --model mode: show interactive model/provider picker and update config
        if (options.model) {
            enterAltScreen();
            let selection: { provider: string; model: string } | null = null;

            const PickerApp: React.FC = () => {
                const handleSelect = (value: { provider: string; model: string } | null) => {
                    selection = value;
                };
                return <ModelPicker config={config} onSelect={handleSelect} />;
            };

            const pickerInstance = render(<PickerApp />);
            await pickerInstance.waitUntilExit();
            exitAltScreen();

            if (!selection) {
                return;
            }

            const sel = selection as { provider: string; model: string };
            const providerId = sel.provider.trim().toLowerCase();
            const modelId = sel.model;

            const updated: any = { ...config };
            updated.provider = providerId;
            updated.model = modelId;
            const existingKeys = (updated.apiKeys ?? {}) as Record<string, string>;

            let apiKeyForProvider = existingKeys[providerId];
            if (!apiKeyForProvider || !apiKeyForProvider.trim()) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                const answer = await new Promise<string>(resolve => {
                    rl.question(`Enter API key for provider "${providerId}": `, resolve);
                });
                rl.close();
                const trimmed = answer.trim();
                if (!trimmed) {
                    console.error('No API key provided; aborting model change.');
                    return;
                }
                apiKeyForProvider = trimmed;
            }

            updated.apiKeys = {
                ...existingKeys,
                [providerId]: apiKeyForProvider,
            };

            await ConfigManager.save(updated);
            console.log(`Updated provider to "${providerId}" and model to "${modelId}".`);

            // Reload config so subsequent logic (one-off or session) uses the new values.
            config = await ConfigManager.load();

            // If the user only wanted to change the model, exit now.
            if (!prompt) {
                return;
            }
        }

        // One-off mode: no alternate screen, just paste into standard output
        if (prompt) {
            const instance = render(<OneOff prompt={prompt} config={config} />);
            await instance.waitUntilExit();
            return;
        }

        // Interactive session mode uses alt-screen for isolation
        enterAltScreen();

        // --select mode: show interactive picker
        if (options.select) {
            const PickerApp = () => {
                const handleSelect = (selectedId: string | null) => {
                    const sessionId = selectedId || generateSessionId();
                    // Unmount picker, render session
                    pickerInstance.unmount();
                    const sessionInstance = render(<Session config={config} sessionId={sessionId} />);
                    sessionInstance.waitUntilExit().then(() => exitAltScreen());
                };
                return <SessionPicker onSelect={handleSelect} />;
            };
            const pickerInstance = render(<PickerApp />);
            await pickerInstance.waitUntilExit();
            return;
        }

        // Direct session (new or resumed)
        const sessionId = options.resume || generateSessionId();
        const instance = render(<Session config={config} sessionId={sessionId} />);
        await instance.waitUntilExit();
        exitAltScreen();
    });

program
    .command('list')
    .description('List recent chat sessions')
    .action(async () => {
        const sessions = await HistoryManager.listSessionsDetailed();
        if (sessions.length === 0) {
            console.log('No recent sessions found.');
            return;
        }
        console.log('Recent sessions:\n');
        for (const s of sessions.slice(0, 20)) {
            const date = new Date(s.mtime).toLocaleString();
            console.log(`  ${s.id}`);
            console.log(`    ${s.name}  (${date})\n`);
        }
        console.log('Use `llm --resume <id>` to continue a session.');
        console.log('Use `llm --select` for interactive selection.');
    });

program
    .command('reset')
    .description('Delete all conversation history and reset configuration')
    .action(async () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const answer = await new Promise<string>(resolve => {
            rl.question('⚠ This will delete ALL conversation history. Are you sure? (yes/no): ', resolve);
        });
        rl.close();

        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            await HistoryManager.deleteAll();
            console.log('✔ All conversation history deleted.');
            console.log('  Config file preserved at ~/.cli-llm/config.json');
            console.log('  Use `llm` to start fresh.');
        } else {
            console.log('Cancelled.');
        }
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