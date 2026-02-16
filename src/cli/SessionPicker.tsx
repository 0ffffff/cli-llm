import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import { HistoryManager, type SessionInfo } from '../history/manager.js';

interface SessionPickerProps {
    onSelect: (sessionId: string | null) => void;
}

interface SelectItem {
    label: string;
    value: string;
}

export const SessionPicker: React.FC<SessionPickerProps> = ({ onSelect }) => {
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { exit } = useApp();

    useEffect(() => {
        async function load() {
            const list = await HistoryManager.listSessionsDetailed();
            setSessions(list);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <Box padding={1}>
                <Text color="cyan">Loading sessions…</Text>
            </Box>
        );
    }

    const items: SelectItem[] = [
        { label: '✨ New Session', value: '__new__' },
        ...sessions.slice(0, 20).map(s => {
            const date = new Date(s.mtime).toLocaleString();
            const label = `${s.name}  (${date})`;
            return { label, value: s.id };
        }),
    ];

    const handleSelect = (item: SelectItem) => {
        if (item.value === '__new__') {
            onSelect(null); // null means "create new session"
        } else {
            onSelect(item.value);
        }
    };

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="blue">● Select a Session</Text>
            </Box>
            <Box marginBottom={1}>
                <Text color="gray">Use ↑/↓ to navigate, Enter to select</Text>
            </Box>
            <SelectInput items={items} onSelect={handleSelect} />
        </Box>
    );
};
