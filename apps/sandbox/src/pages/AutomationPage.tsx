import { PageLayout } from '../components/PageLayout';
import { Settings, Play, Code } from 'lucide-react';

export function AutomationPage() {
    return (
        <PageLayout
            title="Automation"
            description="System automation and scripting"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Script Editor */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-blue-400" />
                        Script Editor
                    </h2>
                    <textarea
                        className="w-full h-64 bg-gray-800 text-gray-300 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="// Write your automation script here&#10;console.log('Hello, Automation!');"
                    />
                    <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Run Script
                    </button>
                </div>

                {/* Automation Tasks */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-green-400" />
                        Scheduled Tasks
                    </h2>
                    <div className="space-y-3">
                        {['Backup Database', 'Clean Logs', 'Update System'].map((task, idx) => (
                            <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">{task}</span>
                                    <span className="text-xs text-gray-500">Daily at 2:00 AM</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
