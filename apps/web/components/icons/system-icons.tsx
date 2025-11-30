import * as React from 'react'
import { cn } from '@/lib/utils'

// Base Icon Props Interface
export interface SystemIconProps {
    className?: string
    width?: number
    height?: number
    strokeWidth?: number
}

// System Settings Icon
export const SystemSettingsIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Gear/cog shape with outer teeth and center circle - represents settings/configuration */}
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            {/* Center hole of the gear */}
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    )
}

// System Security Icon
export const SystemSecurityIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Shield shape with pointed top and curved bottom - represents security/protection */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            {/* Checkmark inside shield - indicates verified/secure status */}
            <path d="M9 12l2 2 4-4"></path>
        </svg>
    )
}

// System Network Icon
export const SystemNetworkIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            <rect x="2" y="9" width="4" height="12" rx="1"></rect>
            <rect x="10" y="5" width="4" height="16" rx="1"></rect>
            <rect x="18" y="2" width="4" height="19" rx="1"></rect>
        </svg>
    )
}

// System Database Icon
export const SystemDatabaseIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
    )
}

// System Cloud Icon
export const SystemCloudIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Cloud shape with curved bottom - represents cloud storage/services */}
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        </svg>
    )
}

// System Server Icon
export const SystemServerIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Top server rack with indicator light */}
            <rect x="2" y="3" width="20" height="4" rx="1"></rect>
            {/* Middle server rack with indicator light */}
            <rect x="2" y="9" width="20" height="4" rx="1"></rect>
            {/* Bottom server rack with indicator light */}
            <rect x="2" y="15" width="20" height="4" rx="1"></rect>
            {/* Server status indicator lights */}
            <line x1="6" y1="5" x2="6.01" y2="5"></line>
            <line x1="6" y1="11" x2="6.01" y2="11"></line>
            <line x1="6" y1="17" x2="6.01" y2="17"></line>
        </svg>
    )
}

// System Terminal Icon
export const SystemTerminalIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
    )
}

// System Code Icon
export const SystemCodeIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Right pointing chevron - represents code/programming */}
            <polyline points="16 18 22 12 16 6"></polyline>
            {/* Left pointing chevron - completes code brackets symbol */}
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
    )
}

// System Package Icon
export const SystemPackageIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Diagonal line showing package depth */}
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
            {/* Main 3D box shape - represents package/container */}
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            {/* Top edges of 3D box */}
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            {/* Vertical edge showing 3D depth */}
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    )
}

// System Monitor Icon
export const SystemMonitorIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main monitor screen */}
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            {/* Monitor stand base */}
            <line x1="8" y1="21" x2="16" y2="21"></line>
            {/* Monitor stand pole */}
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
    )
}

// System Hard Drive Icon
export const SystemHardDriveIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main hard drive body */}
            <rect x="1" y="8" width="22" height="8" rx="2" ry="2"></rect>
            {/* Hard drive activity light strip */}
            <rect x="5" y="11" width="14" height="2" rx="1" ry="1"></rect>
            {/* Power/activity indicator LED */}
            <circle cx="18" cy="12" r="1"></circle>
        </svg>
    )
}

// System Memory Icon
export const SystemMemoryIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main memory chip outline */}
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            {/* Left vertical connection pins */}
            <line x1="9" y1="4" x2="9" y2="20"></line>
            {/* Right vertical connection pins */}
            <line x1="15" y1="4" x2="15" y2="20"></line>
            {/* Top horizontal connection traces */}
            <line x1="4" y1="9" x2="20" y2="9"></line>
            {/* Bottom horizontal connection traces */}
            <line x1="4" y1="15" x2="20" y2="15"></line>
        </svg>
    )
}

// System CPU Icon
export const SystemCPUIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main CPU chip outline */}
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            {/* CPU core/die in center */}
            <rect x="9" y="9" width="6" height="6"></rect>
            {/* Top connection pins */}
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            {/* Bottom connection pins */}
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            {/* Right side connection pins */}
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            {/* Left side connection pins */}
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
        </svg>
    )
}

// System Zap Icon (Power/Energy)
export const SystemZapIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Lightning bolt shape - represents power/electrical energy */}
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    )
}

// System Thermometer Icon
export const SystemThermometerIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Thermometer shape with bulb at bottom - represents temperature monitoring */}
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
        </svg>
    )
}

// System Activity Icon
export const SystemActivityIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* ECG/heartbeat waveform - represents system activity/monitoring */}
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    )
}

// System Download Icon
export const SystemDownloadIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Download container/base */}
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            {/* Downward arrow - indicates download direction */}
            <polyline points="7 10 12 15 17 10"></polyline>
            {/* Arrow shaft */}
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    )
}

// System Upload Icon
export const SystemUploadIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Upload container/base */}
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            {/* Upward arrow - indicates upload direction */}
            <polyline points="17 8 12 3 7 8"></polyline>
            {/* Arrow shaft */}
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
    )
}

// System Refresh Icon
export const SystemRefreshIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Top right curved arrow - represents refresh cycle */}
            <polyline points="23 4 23 10 17 10"></polyline>
            {/* Bottom left curved arrow - completes refresh cycle */}
            <polyline points="1 20 1 14 7 14"></polyline>
            {/* Connecting curved paths forming circular refresh motion */}
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    )
}

// System Trash Icon
export const SystemTrashIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Top lid of trash can */}
            <polyline points="3 6 5 6 21 6"></polyline>
            {/* Main trash can body */}
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            {/* Left vertical deletion lines */}
            <line x1="10" y1="11" x2="10" y2="17"></line>
            {/* Right vertical deletion lines */}
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    )
}

// System Folder Icon
export const SystemFolderIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
    )
}

// System File Icon
export const SystemFileIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main document body */}
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            {/* Folded corner of document */}
            <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
    )
}

// System Search Icon
export const SystemSearchIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Magnifying glass circle */}
            <circle cx="11" cy="11" r="8"></circle>
            {/* Magnifying glass handle */}
            <path d="m21 21-4.35-4.35"></path>
        </svg>
    )
}

// System Bell Icon
export const SystemBellIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Bell body shape */}
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            {/* Bell clapper */}
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
    )
}

// System User Icon
export const SystemUserIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* User torso/body */}
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            {/* User head circle */}
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}

// System Mail Icon
export const SystemMailIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Mail envelope body */}
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            {/* Mail envelope flap lines */}
            <path d="m22 7-10 5L2 7"></path>
        </svg>
    )
}

// System Calendar Icon
export const SystemCalendarIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main calendar body */}
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            {/* Right page tear-off line */}
            <line x1="16" y1="2" x2="16" y2="6"></line>
            {/* Left page tear-off line */}
            <line x1="8" y1="2" x2="8" y2="6"></line>
            {/* Horizontal divider between header and days */}
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    )
}

// System Clock Icon
export const SystemClockIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Clock outer circle */}
            <circle cx="12" cy="12" r="10"></circle>
            {/* Clock hands showing time */}
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    )
}

// System Info Icon
export const SystemInfoIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Info circle outline */}
            <circle cx="12" cy="12" r="10"></circle>
            {/* Vertical line of 'i' character */}
            <line x1="12" y1="16" x2="12" y2="12"></line>
            {/* Dot of 'i' character */}
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    )
}

// System Alert Icon
export const SystemAlertIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Triangle warning shape */}
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            {/* Exclamation mark vertical line */}
            <line x1="12" y1="9" x2="12" y2="13"></line>
            {/* Exclamation mark dot */}
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    )
}

// System Check Icon
export const SystemCheckIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Checkmark shape - represents success/completion */}
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}

// System X Icon (Close/Cancel)
export const SystemXIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* First diagonal line of X */}
            <line x1="18" y1="6" x2="6" y2="18"></line>
            {/* Second diagonal line of X */}
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
}

// System Plus Icon
export const SystemPlusIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Vertical line of plus sign */}
            <line x1="12" y1="5" x2="12" y2="19"></line>
            {/* Horizontal line of plus sign */}
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}

// System Minus Icon
export const SystemMinusIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Horizontal line of minus sign */}
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}

// Export all icons for easy importing
export const SystemIcons = {
    Settings: SystemSettingsIcon,
    Security: SystemSecurityIcon,
    Network: SystemNetworkIcon,
    Database: SystemDatabaseIcon,
    Cloud: SystemCloudIcon,
    Server: SystemServerIcon,
    Terminal: SystemTerminalIcon,
    Code: SystemCodeIcon,
    Package: SystemPackageIcon,
    Monitor: SystemMonitorIcon,
    HardDrive: SystemHardDriveIcon,
    Memory: SystemMemoryIcon,
    CPU: SystemCPUIcon,
    Zap: SystemZapIcon,
    Thermometer: SystemThermometerIcon,
    Activity: SystemActivityIcon,
    Download: SystemDownloadIcon,
    Upload: SystemUploadIcon,
    Refresh: SystemRefreshIcon,
    Trash: SystemTrashIcon,
    Folder: SystemFolderIcon,
    File: SystemFileIcon,
    Search: SystemSearchIcon,
    Bell: SystemBellIcon,
    User: SystemUserIcon,
    Mail: SystemMailIcon,
    Calendar: SystemCalendarIcon,
    Clock: SystemClockIcon,
    Info: SystemInfoIcon,
    Alert: SystemAlertIcon,
    Check: SystemCheckIcon,
    X: SystemXIcon,
    Plus: SystemPlusIcon,
    Minus: SystemMinusIcon,
}

// Folder Icon Components (used in animated-beam-section)
export const AgentsIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Folder shape - represents agents/organization */}
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
    )
}

export const AIIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Center circle - represents AI core/brain */}
            <circle cx="12" cy="12" r="3"></circle>
            {/* Radiating lines - represents AI thinking/neural network */}
            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M20.46 14.04l-4.24 4.24M7.78 1.76L3.54 6"></path>
        </svg>
    )
}

export const CoreIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Outer square - represents core system/component */}
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            {/* Inner square - represents central processing unit */}
            <rect x="9" y="9" width="6" height="6"></rect>
        </svg>
    )
}

export const ThinkingIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Plus sign in circle - represents thinking/processing */}
            <path d="M9 12h6m-3-3v6"></path>
            {/* Circle outline - contains thinking process */}
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
    )
}

export const MemoryIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Main memory chip outline */}
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            {/* Left vertical connection pins */}
            <line x1="9" y1="4" x2="9" y2="20"></line>
            {/* Right vertical connection pins */}
            <line x1="15" y1="4" x2="15" y2="20"></line>
        </svg>
    )
}

export const SDBIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Top ellipse of cylinder - represents structured database */}
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            {/* Middle ring of cylinder - shows data layer */}
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            {/* Side curves and bottom ellipse - completes database cylinder */}
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
    )
}

export const FSIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Folder shape - represents file system storage */}
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
    )
}

export const ShellIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Terminal prompt arrow (>) - represents shell/command line */}
            <polyline points="4 17 10 11 4 5"></polyline>
            {/* Cursor line in terminal */}
            <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
    )
}

export const NetworkingIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Three vertical bars of increasing height - represents network connectivity */}
            <rect x="2" y="9" width="4" height="12" rx="1"></rect>
            <rect x="10" y="5" width="4" height="16" rx="1"></rect>
            <rect x="18" y="2" width="4" height="19" rx="1"></rect>
        </svg>
    )
}

export const MCPIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Gear/cog shape with outer teeth - represents MCP configuration/control */}
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            {/* Center hole of gear */}
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    )
}

export const PluginsIcon: React.FC<SystemIconProps> = ({
    className = '',
    width = 24,
    height = 24,
    strokeWidth = 2,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('lucide-icon', className)}
        >
            {/* Star shape - represents plugins/add-ons */}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
    )
}

// Icon component mapping for easy access
export const FolderIcons = {
    agents: AgentsIcon,
    ai: AIIcon,
    core: CoreIcon,
    thinking: ThinkingIcon,
    memory: MemoryIcon,
    sdb: SDBIcon,
    fs: FSIcon,
    shell: ShellIcon,
    networking: NetworkingIcon,
    mcp: MCPIcon,
    plugins: PluginsIcon,
}