import React from 'react';

export interface VoiceBadgeProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  showBilingual?: boolean;
  lang?: 'en' | 'ur' | string;
}

/**
 * Official Recording Badge ("🎙️ Official Recording" / "اصل صوتی ریکارڈنگ")
 * Respectful, muted tag styling matching the app's neutral secondary chip visual style.
 */
export const OfficialRecordingBadge: React.FC<VoiceBadgeProps> = ({
  className = '',
  size = 'sm',
  showBilingual = true,
  lang = 'ur'
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  const label = showBilingual
    ? '🎙️ Official Recording (اصل صوتی ریکارڈنگ)'
    : lang === 'en'
    ? '🎙️ Official Recording'
    : '🎙️ اصل صوتی ریکارڈنگ';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-300/80 dark:border-slate-700/80 shadow-xs shrink-0 select-none ${sizeClasses} ${className}`}
      title="Official Recitation Recording"
    >
      <span>{label}</span>
    </span>
  );
};

/**
 * AI Voice Badge ("🤖 AI Voice" / "مصنوعی ذہانت کی آواز")
 * Respectful, muted tag styling matching the app's neutral secondary chip visual style.
 */
export const AIVoiceBadge: React.FC<VoiceBadgeProps> = ({
  className = '',
  size = 'sm',
  showBilingual = true,
  lang = 'ur'
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  const label = showBilingual
    ? '🤖 AI Voice (مصنوعی ذہانت کی آواز)'
    : lang === 'en'
    ? '🤖 AI Voice'
    : '🤖 مصنوعی ذہانت کی آواز';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-300/80 dark:border-slate-700/80 shadow-xs shrink-0 select-none ${sizeClasses} ${className}`}
      title="Text-to-Speech AI Reader"
    >
      <span>{label}</span>
    </span>
  );
};

export interface VoiceSourceBadgeProps extends VoiceBadgeProps {
  variant: 'official' | 'ai' | 'human';
}

/**
 * Unified VoiceSourceBadge component taking a variant prop
 */
export const VoiceSourceBadge: React.FC<VoiceSourceBadgeProps> = ({ variant, ...props }) => {
  if (variant === 'official' || variant === 'human') {
    return <OfficialRecordingBadge {...props} />;
  }
  return <AIVoiceBadge {...props} />;
};

export default VoiceSourceBadge;
