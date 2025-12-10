import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

interface PageLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="mb-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-2">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-dark-muted hover:text-brand-primary transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-dark-border" />
                    <span className="text-brand-primary font-medium">{title}</span>
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
