import { PackageCard } from '../components/PackageCard';
import { osPackages } from '../data/packages'; // Assuming this exists or I need to find where it is. It was imported in the original file.
import { DashboardLayout } from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function Dashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/10 border border-white/5 p-8 md:p-12">
                    <div className="relative z-10 max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                            Welcome to Operone Sandbox
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-dark-muted"
                        >
                            Your advanced operating system simulation environment. Monitor network activity, file systems, and manage processes in real-time.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6"
                        >
                            <Link
                                to="/docs"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/10 hover:border-white/20 backdrop-blur-sm group"
                            >
                                <BookOpen className="w-5 h-5 text-brand-primary" />
                                <span>View System Documentation</span>
                            </Link>
                        </motion.div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-secondary/20 rounded-full blur-3xl opacity-50" />
                </div>

                {/* Packages Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 rounded-full bg-brand-accent" />
                        Installed Modules
                    </h2>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        {osPackages.map((pkg) => (
                            <motion.div key={pkg.id} variants={item}>
                                <PackageCard package={pkg} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
