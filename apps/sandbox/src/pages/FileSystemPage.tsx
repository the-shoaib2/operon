import { PageLayout } from '../components/PageLayout';
import { FolderTree, File, Folder, Plus, Trash2, Copy, Move } from 'lucide-react';

export function FileSystemPage() {
    return (
        <PageLayout
            title="File System"
            description="File and folder management operations"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Browser */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FolderTree className="w-5 h-5 text-blue-400" />
                            File Browser
                        </h2>
                        <button className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New
                        </button>
                    </div>

                    {/* File Tree */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                            <Folder className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300">Documents</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer ml-4">
                            <File className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">file1.txt</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                            <Folder className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300">Downloads</span>
                        </div>
                    </div>
                </div>

                {/* Operations Panel */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Operations</h2>
                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-3">
                            <Copy className="w-5 h-5 text-blue-400" />
                            Copy
                        </button>
                        <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-3">
                            <Move className="w-5 h-5 text-green-400" />
                            Move
                        </button>
                        <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
