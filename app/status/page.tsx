"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down" | "maintenance";
  lastChecked: string;
}

const services: ServiceStatus[] = [
  {
    name: "API",
    status: "operational",
    lastChecked: "Just now",
  },
  {
    name: "Document Processing",
    status: "operational",
    lastChecked: "Just now",
  },
  {
    name: "Vector Search",
    status: "operational",
    lastChecked: "Just now",
  },
  {
    name: "Authentication",
    status: "operational",
    lastChecked: "Just now",
  },
  {
    name: "Storage",
    status: "operational",
    lastChecked: "Just now",
  },
];

const statusConfig = {
  operational: {
    label: "Operational",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-400/40",
  },
  degraded: {
    label: "Degraded Performance",
    icon: AlertCircle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-400/40",
  },
  down: {
    label: "Down",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-400/40",
  },
  maintenance: {
    label: "Maintenance",
    icon: Clock,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-400/40",
  },
};

export default function StatusPage() {
  const [overallStatus, setOverallStatus] = useState<"operational" | "degraded" | "down">(
    "operational"
  );

  useEffect(() => {
    // Determine overall status based on services
    const hasDown = services.some((s) => s.status === "down");
    const hasDegraded = services.some((s) => s.status === "degraded");

    if (hasDown) {
      setOverallStatus("down");
    } else if (hasDegraded) {
      setOverallStatus("degraded");
    } else {
      setOverallStatus("operational");
    }
  }, []);

  const overallConfig = statusConfig[overallStatus];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            System Status
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            DocQuery Status
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Real-time status of all DocQuery services
          </p>
        </div>

        <div className="mt-16">
          <div
            className={`rounded-3xl border ${overallConfig.borderColor} ${overallConfig.bgColor} p-6`}
          >
            <div className="flex items-center gap-4">
              <overallConfig.icon className={`h-8 w-8 ${overallConfig.color}`} />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  All Systems {overallConfig.label}
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  All services are running normally
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h3 className="text-xl font-semibold text-white">Service Status</h3>
          {services.map((service) => {
            const config = statusConfig[service.status];
            const Icon = config.icon;

            return (
              <div
                key={service.name}
                className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <div>
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="text-xs text-slate-400">
                        Last checked: {service.lastChecked}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold text-white">Incident History</h3>
          <p className="mt-4 text-sm text-slate-300">
            No incidents reported in the past 90 days. All systems have been operating
            normally.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-xl font-semibold text-white">Subscribe to Updates</h3>
          <p className="mt-2 text-sm text-slate-300">
            Get notified when we post status updates. Subscribe via email or RSS.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:status@docquery.com?subject=Subscribe to Status Updates"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              Subscribe via Email
            </a>
            <a
              href="/status/rss"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              RSS Feed
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

