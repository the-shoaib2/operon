import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-black">
            {/* Header with Breadcrumb */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className="text-blue-400">{title}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-gray-400 mt-2">{description}</p>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
