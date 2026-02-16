import * as React from 'react';
import { Text } from 'ink';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

// Configure marked to use terminal renderer
marked.setOptions({
    renderer: new TerminalRenderer()
});

interface MarkdownProps {
    children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    // marked() returns a string (or promise, but here it's sync)
    const rendered = (marked.parse(children) as string).trim();
    return <Text>{rendered}</Text>;
};
