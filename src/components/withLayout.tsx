import React, { ComponentType } from 'react';
import Layout from './Layout';
import { GetStaticProps } from 'next';

interface LayoutOptions {
    title?: string;
    description?: string;
    pageHeader?: boolean;
}
export interface PageProps {
    serverBlockfrostKey: string | null;
    serverMediatorDID: string | null;
    serverResolverUrl: string | null;
    isBlockfrostManaged: boolean;
    isMediatorManaged: boolean;
    isResolverManaged: boolean;
}

export const getLayoutProps: GetStaticProps<PageProps> = async () => {
    const serverBlockfrostKey = process.env.BLOCKFROST_API_KEY || null;
    const serverMediatorDID = process.env.MEDIATOR_DID || null;
    const serverResolverUrl = process.env.PRISM_RESOLVER_URL || null;
    return {
        props: {
            serverBlockfrostKey,
            serverMediatorDID,
            serverResolverUrl,
            isBlockfrostManaged: !!serverBlockfrostKey,
            isMediatorManaged: !!serverMediatorDID,
            isResolverManaged: !!serverResolverUrl,
        },
    };
};




export const getStaticProps = getLayoutProps;

/**
 * Higher-order component that wraps a page component with Layout
 * @param PageComponent - The page component to wrap
 * @param layoutOptions - Configuration options for the Layout component
 * @returns A new component wrapped with Layout
 */
export function withLayout<T extends PageProps>(
    PageComponent: ComponentType<T>,
    layoutOptions: LayoutOptions = {}
) {
    const WrappedComponent = (props: T) => {
        return (
            <Layout {...layoutOptions} {...props}>    
                <PageComponent {...(props as T)} />
            </Layout>
        );
    };

    // Set display name for debugging
    WrappedComponent.displayName = `withLayout(${PageComponent.displayName || PageComponent.name || 'Component'})`;

    return WrappedComponent;
}

export default withLayout; 