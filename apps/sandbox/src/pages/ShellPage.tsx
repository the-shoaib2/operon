import { PageLayout } from '../components/PageLayout';
import { Terminal } from '../components/Terminal';

export function ShellPage() {
    return (
        <PageLayout
            title="Shell"
            description="Command-line interface and shell operations"
        >
            <div className="border border-gray-800 rounded-lg bg-gray-900 overflow-hidden h-[calc(100vh-12rem)]">
                <Terminal />
            </div>
        </PageLayout>
    );
}
