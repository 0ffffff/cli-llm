import { ConfigManager } from './src/config/manager.js';

async function testConfig() {
    const initial = await ConfigManager.load();
    console.log('Initial model:', initial.model);

    const testKey = 'nv-test-key-' + Math.random().toString(36).substring(7);
    await ConfigManager.save({
        ...initial,
        apiKey: testKey
    });

    const updated = await ConfigManager.load();
    if (updated.apiKey === testKey) {
        console.log('Config save/load verified!');
    } else {
        console.error('Config verification failed!');
        process.exit(1);
    }
}

testConfig();
