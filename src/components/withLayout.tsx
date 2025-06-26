import React, { ComponentType } from 'react';
import Layout from './Layout';

interface LayoutOptions {
    title?: string;
    description?: string;
    showDIDSelector?: boolean;
    pageHeader?: boolean;
}

/**
 * Higher-order component that wraps a page component with Layout
 * @param PageComponent - The page component to wrap
 * @param layoutOptions - Configuration options for the Layout component
 * @returns A new component wrapped with Layout
 */
export function withLayout<T extends Record<string, unknown> = Record<string, unknown>>(
    PageComponent: ComponentType<T>,
    layoutOptions: LayoutOptions = {}
) {
    const WrappedComponent = (props: T) => {
        return (
            <Layout {...layoutOptions}>    
                <PageComponent {...(props as T)} />
            </Layout>
        );
    };

    // Set display name for debugging
    WrappedComponent.displayName = `withLayout(${PageComponent.displayName || PageComponent.name || 'Component'})`;

    return WrappedComponent;
}

export default withLayout; 