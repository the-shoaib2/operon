import { PageLayout } from '../components/PageLayout';
import { MemoryStick, HardDrive } from 'lucide-react';

export function MemoryPage() {
    return (
        <PageLayout
            title="Memory"
            description="Memory management and allocation visualization"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Memory Usage */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <MemoryStick className="w-5 h-5 text-blue-400" />
                        Memory Usage
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">RAM</span>
                                <span className="text-white">8.2 GB / 16 GB</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3">
                                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '51%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Swap</span>
                                <span className="text-white">1.5 GB / 4 GB</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3">
                                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '37.5%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heap & Stack */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <HardDrive className="w-5 h-5 text-green-400" />
                        Heap & Stack
                    </h2>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-800 rounded">
                            <div className="text-sm text-gray-400 mb-1">Heap Size</div>
                            <div className="text-lg text-white font-mono">2.4 GB</div>
                        </div>
                        <div className="p-3 bg-gray-800 rounded">
                            <div className="text-sm text-gray-400 mb-1">Stack Size</div>
                            <div className="text-lg text-white font-mono">128 MB</div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
