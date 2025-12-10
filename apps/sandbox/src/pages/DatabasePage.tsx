import { PageLayout } from '../components/PageLayout';
import { Database, Table, Plus } from 'lucide-react';

export function DatabasePage() {
    return (
        <PageLayout
            title="Database"
            description="Database operations and management"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tables List */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            Tables
                        </h2>
                        <button className="p-1.5 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {['users', 'posts', 'comments', 'sessions'].map((table) => (
                            <div key={table} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                                <Table className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">{table}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Query Editor */}
                <div className="lg:col-span-2 border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Query Editor</h2>
                    <textarea
                        className="w-full h-40 bg-gray-800 text-gray-300 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="SELECT * FROM users WHERE id = 1;"
                    />
                    <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        Execute Query
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}
