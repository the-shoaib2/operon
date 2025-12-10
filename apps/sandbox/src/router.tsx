import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { NetworkingPage } from './pages/NetworkingPage';
import { FileSystemPage } from './pages/FileSystemPage';
import { ShellPage } from './pages/ShellPage';
import { MCPPage } from './pages/MCPPage';
import { MemoryPage } from './pages/MemoryPage';
import { ProcessPage } from './pages/ProcessPage';
import { DatabasePage } from './pages/DatabasePage';
import { AutomationPage } from './pages/AutomationPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/networking',
        element: <NetworkingPage />,
    },
    {
        path: '/filesystem',
        element: <FileSystemPage />,
    },
    {
        path: '/shell',
        element: <ShellPage />,
    },
    {
        path: '/mcp',
        element: <MCPPage />,
    },
    {
        path: '/memory',
        element: <MemoryPage />,
    },
    {
        path: '/process',
        element: <ProcessPage />,
    },
    {
        path: '/database',
        element: <DatabasePage />,
    },
    {
        path: '/automation',
        element: <AutomationPage />,
    },
]);
