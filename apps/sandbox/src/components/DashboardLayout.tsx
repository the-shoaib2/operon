import { type ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}



export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-dark-bg text-dark-text flex overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto relative">
                    <div className="max-w-7xl mx-auto p-2 md:p-4 pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
