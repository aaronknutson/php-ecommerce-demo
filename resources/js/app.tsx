import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

createInertiaApp({
    title: (title) => {
        // Use runtime app name from Inertia shared props (set in HandleInertiaRequests)
        // This ensures the app name comes from APP_NAME env var at runtime, not build time
        const page = document.getElementById('app')?.dataset.page;
        const appName = page ? JSON.parse(page).props?.name || 'Laravel' : 'Laravel';
        return title ? `${title} - ${appName}` : appName;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
