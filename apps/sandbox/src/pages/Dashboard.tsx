import { PackageCard } from '../components/PackageCard';
import { osPackages } from '../data/packages';

export function Dashboard() {
    return (
        <div className="min-h-screen w-full bg-black">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">

            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Package Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {osPackages.map((pkg) => (
                        <PackageCard key={pkg.id} package={pkg} />
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-16 text-center">
                   
                </div>
            </main>
        </div>
    );
}
