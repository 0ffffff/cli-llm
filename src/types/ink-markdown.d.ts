declare module 'ink-markdown' {
    import { FC } from 'react';
    interface Props {
        children: string;
    }
    const Markdown: FC<Props>;
    export default Markdown;
}
