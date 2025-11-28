import React, { useEffect, useState } from 'react';
import { useOS } from '../contexts/OSContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SystemStatus: React.FC = () => {
    const { system } = useOS();
    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await system.getMetrics();
                setMetrics(data);
            } catch (err) {
                console.error('Failed to fetch metrics:', err);
                setError('Failed to fetch system metrics');
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, [system]);

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <div className="text-destructive">{error}</div>
                </CardContent>
            </Card>
        );
    }

    if (!metrics) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-muted-foreground">Loading system metrics...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">CPU Usage</p>
                        <p className="text-xl font-bold">{metrics.cpu?.usage?.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Memory Usage</p>
                        <p className="text-xl font-bold">
                            {((metrics.memory?.used / metrics.memory?.total) * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-xl font-bold">{Math.floor(metrics.uptime / 3600)}h</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Platform</p>
                        <p className="text-xl font-bold">{metrics.platform}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
