import { useNavigate } from 'react-router-dom';
import type { OSPackage } from '../data/packages';

interface PackageCardProps {
    package: OSPackage;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(pkg.route)}
            className="group relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
        >
            {/* Icon Container */}
            <div className="mb-4 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                <pkg.icon className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>

            {/* Package Name */}
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {pkg.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 text-center line-clamp-2 group-hover:text-gray-300 transition-colors">
                {pkg.description}
            </p>

            {/* Category Badge */}
            <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    {pkg.category}
                </span>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300" />
        </button>
    );
}
