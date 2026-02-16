import * as React from 'react';
import MarkdownRenderer from 'ink-markdown';

interface MarkdownProps {
    children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return <MarkdownRenderer>{children}</MarkdownRenderer>;
};
