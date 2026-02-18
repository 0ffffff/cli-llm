import * as React from 'react';
import TextInput from 'ink-text-input';
import ansiRegex from 'ansi-regex';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    focus?: boolean;
    mask?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSubmit,
    placeholder,
    focus,
    mask
}) => {
    const handleChange = (val: string) => {
        // 1. Filter out standard ANSI escape sequences
        const pkgRegex = ansiRegex();

        // 2. Filter out "naked" mouse reporting sequences and fragments (e.g., [<65;80;34M)
        // These often leak into input when mouse events aren't fully consumed by the terminal.
        const mouseRegex = /\[<[0-9; ]*[MmNnL]|([0-9]{1,3}[; ]+){1,2}[0-9]{1,3}[MmNnL]?|‹|\[<[0-9]*|\[[()#;?<>]*[0-9;?<>]*[A-PRZcf-nqry=><]/g;

        // Regex to strip ASCII control characters (0-31, 127) and extended control chars (128-159)
        const controlCharsRegex = /[\x00-\x1F\x7F-\x9F]/g;

        const filtered = val
            .replace(pkgRegex, '')
            .replace(mouseRegex, '')
            .replace(controlCharsRegex, '');

        onChange(filtered);
    };

    return (
        <TextInput
            value={value}
            onChange={handleChange}
            onSubmit={onSubmit}
            placeholder={placeholder}
            focus={focus}
            mask={mask}
        />
    );
};
