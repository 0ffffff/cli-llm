import * as React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

export const Thinking: React.FC = () => {
    return (
        <Box>
            <Text color="cyan">
                <Spinner type="dots" />
            </Text>
            <Text color="cyan" italic> Kimi is thinking...</Text>
        </Box>
    );
};
