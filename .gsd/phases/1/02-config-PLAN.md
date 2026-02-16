---
phase: 1
plan: 2
wave: 2
depends_on: [1]
files_modified: [src/config/manager.ts, src/config/types.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Global configuration can be read from and written to the home directory"
    - "API keys are stored securely in a local config file"
  artifacts:
    - "src/config/manager.ts exists and exports get/save methods"
---

# Plan 1.2: Configuration Manager

<objective>
Implement a robust configuration manager to handle global settings and API keys.
Purpose: Provide a single source of truth for the application's configuration.
Output: source/config/manager.ts
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
</context>

<tasks>

<task type="auto">
  <name>Define Config Schema & Utility</name>
  <files>src/config/types.ts, src/config/manager.ts</files>
  <action>
    Create a schema for the configuration (API key, default model, global settings).
    Implement a `ConfigManager` that:
    - Locates the config file at `~/.cli-llm/config.json`.
    - Has `load()` and `save(config)` methods.
    - Handles directory creation (`mkdir -p`).
    AVOID: storing keys in plain text if simple obfuscation is feasible (though local JSON is standard for dev tools, ensure file permissions are restricted if possible). For now, standard local JSON in a hidden folder is the goal.
  </action>
  <verify>Run a test script to save and then load config</verify>
  <done>Config is correctly persisted and retrieved from filesystem</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Config file exists in home directory after save
- [ ] Read operation returns the exact data written
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
