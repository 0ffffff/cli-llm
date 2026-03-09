import * as React from 'react';
import { memo, useMemo } from 'react';
import { Text } from 'ink';

interface StreamingTextProps {
    children: string;
    width?: number;
}

function wrapToWidth(input: string, width: number): string {
    if (width <= 1) return input;
    const lines = input.split('\n');
    const out: string[] = [];
    for (const line of lines) {
        if (line.length <= width) {
            out.push(line);
            continue;
        }
        let i = 0;
        while (i < line.length) {
            out.push(line.slice(i, i + width));
            i += width;
        }
    }
    return out.join('\n');
}

export const StreamingText: React.FC<StreamingTextProps> = memo(({ children, width = 80 }) => {
    const wrapped = useMemo(() => wrapToWidth(children, width), [children, width]);
    return <Text>{wrapped}</Text>;
});

