import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronRight, BookOpen } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { DocsModal } from './DocsModal';
import { moduleDocs } from '../data/docs';

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
    const navigate = useNavigate();

    const [showDocs, setShowDocs] = useState(false);
    const location = useLocation();

    return (
        <DashboardLayout>
            <DocsModal
                isOpen={showDocs}
                onClose={() => setShowDocs(false)}
                title={title}
                sections={moduleDocs[location.pathname] || []}
            />

            <div className="mb-4">
                {/* Breadcrumb & Help */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1 text-dark-muted hover:text-brand-primary transition-colors"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-dark-border" />
                        <span className="text-brand-primary font-medium">{title}</span>
                    </div>

                    {moduleDocs[location.pathname] && (
                        <button
                            onClick={() => setShowDocs(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/20 rounded-lg transition-colors"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            Documentation
                        </button>
                    )}
                </div>

                {/* Title Section */}
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-1">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-dark-muted text-sm max-w-2xl">{description}</p>
                    )}
                </div>
            </div>

            {/* Main Content Animation Container */}
            <div className="animate-fade-in">
                {children}
            </div>
        </DashboardLayout>
    );
}
