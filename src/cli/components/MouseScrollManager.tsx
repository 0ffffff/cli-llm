import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { DOMElement } from 'ink';
import { useMouse, useOnMouseHover } from '@zenobius/ink-mouse';

export interface MouseScrollManagerProps {
    viewportRef: React.RefObject<DOMElement>;
    onScrollBy: (delta: number) => void;
}

export const MouseScrollManager: React.FC<MouseScrollManagerProps> = ({ viewportRef, onScrollBy }) => {
    // NOTE: `useMouse()` re-renders on *mouse movement*. Keep this component tiny
    // so it doesn't cause the whole session (and controlled ChatInput) to lag.
    const mouse = useMouse();
    const [hoveringViewport, setHoveringViewport] = useState(false);
    useOnMouseHover(viewportRef, setHoveringViewport);

    // Keep latest callback without re-subscribing on every render
    const onScrollByRef = useRef(onScrollBy);
    useEffect(() => {
        onScrollByRef.current = onScrollBy;
    }, [onScrollBy]);

    useEffect(() => {
        mouse.enable();
        return () => mouse.disable();
        // Only on mount/unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handler = (_pos: { x: number; y: number }, direction: 'scrollup' | 'scrolldown' | null) => {
            if (!hoveringViewport || !direction) return;
            onScrollByRef.current(direction === 'scrollup' ? -3 : 3);
        };

        mouse.events.on('scroll', handler);
        return () => {
            mouse.events.off('scroll', handler);
        };
    }, [mouse, hoveringViewport]);

    return null;
};
