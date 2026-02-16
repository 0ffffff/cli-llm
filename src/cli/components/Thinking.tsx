import * as React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

export const Thinking: React.FC = () => {
    return (
        <Box>
            <Text color="yellow">
                <Spinner type="dots" />
            </Text>
            <Text color="yellow"> Thinking...</Text>
        </Box>
    );
};
