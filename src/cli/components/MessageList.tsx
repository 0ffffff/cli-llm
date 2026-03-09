import * as React from 'react';
import { memo } from 'react';
import { Box, Text } from 'ink';
import { Markdown } from './Markdown.js';
import type { ChatMessage } from '../../api/types.js';

interface MessageListProps {
    messages: ChatMessage[];
    width: number;
    displayName: string;
}

export const MessageList: React.FC<MessageListProps> = memo(
    ({ messages, width, displayName }) => {
        return (
            <>
                {messages.map((msg, index) => (
                    <Box key={index} flexDirection="column" marginBottom={1} flexShrink={0}>
                        <Box flexShrink={0}>
                            <Text bold color={msg.role === 'user' ? 'green' : 'cyan'}>
                                {msg.role === 'user' ? '[YOU]' : `[${displayName.toUpperCase()}]`}
                            </Text>
                        </Box>
                        <Box paddingLeft={2} flexShrink={0}>
                            <Markdown width={width - 6}>{msg.content}</Markdown>
                        </Box>
                    </Box>
                ))}
            </>
        );
    },
    (prev, next) =>
        prev.messages === next.messages &&
        prev.width === next.width &&
        prev.displayName === next.displayName
);

