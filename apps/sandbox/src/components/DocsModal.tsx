import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Terminal } from 'lucide-react';
import type { DocSection } from '../data/docs';

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    sections: DocSection[];
}

export function DocsModal({ isOpen, onClose, title, sections }: DocsModalProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-[600px] md:max-h-[80vh] bg-dark-surface border border-dark-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-dark-border bg-dark-bg/50">
                            <div className="flex items-center gap-2 text-white font-semibold">
                                <Book className="w-5 h-5 text-brand-primary" />
                                <span>{title} Documentation</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-dark-muted hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-l-2 border-brand-primary pl-3">
                                        {section.title}
                                    </h3>

                                    {section.content && (
                                        <div className="text-dark-text/90 leading-relaxed whitespace-pre-line text-sm">
                                            {section.content}
                                        </div>
                                    )}

                                    {section.commands && (
                                        <div className="grid gap-3">
                                            {section.commands.map((cmd, cmdIdx) => (
                                                <div key={cmdIdx} className="bg-dark-bg rounded-lg border border-dark-border p-3 group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-brand-secondary">{cmd.name}</span>
                                                        <span className="text-xs text-dark-muted">{cmd.description}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-black/30 rounded p-2 font-mono text-xs text-green-400">
                                                        <Terminal className="w-3 h-3 opacity-50" />
                                                        <span>{cmd.cmd}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
