import { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { moduleDocs } from '../data/docs';
import { Terminal, ScrollText } from 'lucide-react';

export function DocsPage() {
    const [activeSection, setActiveSection] = useState<string>(Object.keys(moduleDocs)[0]);

    const activeDocs = moduleDocs[activeSection] || [];

    // Helper to format path to readable name
    const formatName = (path: string) => {
        return path.replace('/', '').charAt(0).toUpperCase() + path.slice(2);
    };

    return (
        <PageLayout
            title="System Documentation"
            description="Comprehensive guide to installed modules and system capabilities."
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0 bg-dark-surface border border-dark-border rounded-xl p-4 overflow-y-auto custom-scrollbar">
                    <h2 className="text-sm font-semibold text-dark-muted mb-4 uppercase tracking-wider px-2">Modules</h2>
                    <div className="space-y-1">
                        {Object.keys(moduleDocs).map((path) => (
                            <button
                                key={path}
                                onClick={() => setActiveSection(path)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === path
                                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                        : 'text-dark-text hover:bg-white/5'
                                    }`}
                            >
                                {formatName(path)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-dark-surface border border-dark-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                        {/* Header for the section */}
                        <div className="flex items-center gap-3 pb-6 border-b border-dark-border">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <ScrollText className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{formatName(activeSection)}</h2>
                                <p className="text-sm text-dark-muted">Module Usage Guide</p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        {activeDocs.map((section, idx) => (
                            <div key={idx} className="space-y-4 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                                    {section.title}
                                </h3>

                                {section.content && (
                                    <div className="text-dark-text/90 leading-relaxed whitespace-pre-line text-sm pl-4 border-l border-dark-border/50">
                                        {section.content}
                                    </div>
                                )}

                                {section.commands && (
                                    <div className="grid gap-3 pt-2">
                                        {section.commands.map((cmd, cmdIdx) => (
                                            <div key={cmdIdx} className="bg-dark-bg/50 rounded-lg border border-dark-border p-4 hover:border-brand-primary/30 transition-colors group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-brand-secondary">{cmd.name}</span>
                                                    <span className="text-xs text-dark-muted">{cmd.description}</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-black/40 rounded-md p-3 font-mono text-sm text-green-400 border border-white/5">
                                                    <Terminal className="w-4 h-4 opacity-50 flex-shrink-0" />
                                                    <span className="select-all">{cmd.cmd}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {activeDocs.length === 0 && (
                            <div className="text-center py-20 text-dark-muted">
                                <p>No documentation available for this module yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
