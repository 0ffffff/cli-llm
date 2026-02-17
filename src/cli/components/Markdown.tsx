import * as React from 'react';
import { useMemo, memo } from 'react';
import { Text } from 'ink';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

interface MarkdownProps {
    children: string;
    width?: number;
}

export const Markdown: React.FC<MarkdownProps> = memo(({ children, width = 80 }) => {
    const rendered = useMemo(() => {
        // Create a renderer instance for this specific width
        const renderer = new TerminalRenderer({
            width: width,
            reflowText: true
        }) as any;

        return (marked.parse(children, { renderer }) as string).trim();
    }, [children, width]);

    return <Text>{rendered}</Text>;
});
