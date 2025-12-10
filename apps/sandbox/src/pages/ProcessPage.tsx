import { PageLayout } from '../components/PageLayout';
import { Cpu, Activity, Pause, Play } from 'lucide-react';

export function ProcessPage() {
    return (
        <PageLayout
            title="Process"
            description="Process management and CPU scheduling"
        >
            <div className="space-y-6">
                {/* CPU Usage */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-blue-400" />
                        CPU Usage
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((core) => (
                            <div key={core} className="p-4 bg-gray-800 rounded-lg">
                                <div className="text-sm text-gray-400 mb-2">Core {core}</div>
                                <div className="text-2xl text-white font-mono">{Math.floor(Math.random() * 100)}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process List */}
                <div className="border border-gray-800 rounded-lg bg-gray-900 p-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <Cpu className="w-5 h-5 text-green-400" />
                        Running Processes
                    </h2>
                    <div className="space-y-2">
                        {['System', 'Browser', 'Terminal', 'Editor'].map((process, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Cpu className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{process}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400 font-mono">PID: {1000 + idx}</span>
                                    <button className="p-1 hover:bg-gray-600 rounded">
                                        <Pause className="w-4 h-4 text-yellow-400" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-600 rounded">
                                        <Play className="w-4 h-4 text-green-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
