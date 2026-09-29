import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2, Shield } from 'lucide-react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  status: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
}) => {
  const normalized = status.toLowerCase();

  let config = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
    text: 'LOW RISK',
    ariaLabel: 'Risk status: Low risk',
  };

  if (normalized.includes('urgent') || normalized.includes('critical') || normalized.includes('severe')) {
    config = {
      bg: 'bg-rose-100 text-rose-900 border-rose-400 font-black',
      icon: ShieldAlert,
      text: 'URGENT RISK',
      ariaLabel: 'Risk status: Urgent risk',
    };
  } else if (normalized.includes('high')) {
    config = {
      bg: 'bg-red-100 text-red-900 border-red-400 font-extrabold',
      icon: AlertTriangle,
      text: 'HIGH RISK',
      ariaLabel: 'Risk status: High risk',
    };
  } else if (normalized.includes('escalating')) {
    config = {
      bg: 'bg-orange-100 text-orange-900 border-orange-400 font-bold',
      icon: AlertCircle,
      text: 'ESCALATING',
      ariaLabel: 'Risk status: Escalating',
    };
  } else if (normalized.includes('moderate') || normalized.includes('medium')) {
    config = {
      bg: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
      icon: AlertCircle,
      text: 'MODERATE RISK',
      ariaLabel: 'Risk status: Moderate risk',
    };
  } else if (normalized.includes('stable') || normalized.includes('routine')) {
    config = {
      bg: 'bg-teal-50 text-teal-800 border-teal-300 font-medium',
      icon: Shield,
      text: 'STABLE / LOW',
      ariaLabel: 'Risk status: Stable low',
    };
  }

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-xs gap-1.5'
      : size === 'md'
      ? 'px-2.5 py-1 text-[11px] gap-1.2'
      : 'px-2 py-0.5 text-[10px] gap-1';

  const IconComponent = config.icon;

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center rounded-md border font-sans tracking-wide uppercase shadow-2xs ${config.bg} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.text}</span>
    </span>
  );
};
