import * as React from 'react';
import { Box, Text } from 'ink';

export const Footer: React.FC = () => {
    return (
        <Box marginTop={0}>
            <Text color="gray" dimColor>
                Ctrl+C to exit | Made by some gooners at berkeley
            </Text>
        </Box>
    );
};
