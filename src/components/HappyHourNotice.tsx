import React from 'react';
import { Flame, Clock, Calendar, AlertCircle } from 'lucide-react';
import { HappyHourStatus } from '../utils/happyHour';

interface HappyHourNoticeProps {
  status: HappyHourStatus;
}

export const HappyHourNotice: React.FC<HappyHourNoticeProps> = ({ status }) => {
  return (
    <div className="mb-8 rounded-2xl bg-[#141518] border border-[#262930] p-5 sm:p-6 overflow-hidden relative">
      {/* Subtle orange accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5A16] via-[#FF9A52] to-[#FF5A16]"
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Status and title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FF5A16]/10 text-[#FF5A16]">
              <Flame className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                status.isActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]'
              }`}
            >
              {status.statusLabel}
            </span>
            <span aria-hidden="true" className="text-[#262930]">
              ·
            </span>
            <span className="text-xs text-[#B9BCC3] font-mono tabular-nums flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FF5A16]" />
              {status.timeInEstablishment} (Fuso SP)
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-[#F5F3EE]">
            Programação Semanal do Happy Hour
          </h3>

          <p className="text-xs sm:text-sm text-[#FF9A52] font-medium flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Valores válidos no horário do Happy Hour</span>
          </p>
        </div>

        {/* Right: Detailed schedule times */}
        <div className="bg-[#1B1D22] border border-[#262930] rounded-xl p-3 sm:p-4 text-xs space-y-2 shrink-0">
          <div className="flex items-center gap-2 text-[#F5F3EE]">
            <Calendar className="w-3.5 h-3.5 text-[#FF5A16] shrink-0" />
            <span className="font-semibold">{status.activeTodaySchedule}</span>
          </div>
          <div className="text-[11px] text-[#B9BCC3] space-y-1 border-t border-[#262930]/60 pt-2">
            <div>
              <span className="text-[#F5F3EE]">Horário programado:</span> {status.scheduleDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
