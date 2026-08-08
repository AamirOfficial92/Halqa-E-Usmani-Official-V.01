/**
 * Slip ID & User ID Generation Logic for Halqa-e-Usmania
 * Format: HU-[BranchCode]-[Year]-[Month]-[MonthlySlipNo]-[OverallSlipNo]
 * Example: HU-MALIR01-2026-07-0008-00564
 */

import { SpiritualSlip, AppUser } from '../types';

/**
 * Calculates the next Monthly and Overall counters and formats the Slip ID
 */
export function generateSlipId(
  branchCode: string,
  allSlips: SpiritualSlip[],
  dateStr?: string
): {
  slipId: string;
  year: number;
  month: number;
  monthlySlipNo: number;
  overallSlipNo: number;
} {
  const dateObj = dateStr ? new Date(dateStr) : new Date();
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // 1-12

  const cleanBranchCode = (branchCode || 'MALIR01').toUpperCase().trim();

  // Filter slips for this branch, year, and month
  const branchMonthlySlips = allSlips.filter(
    (s) => s.branchCode === cleanBranchCode && s.year === year && s.month === month
  );

  let maxMonthlyNo = 0;
  branchMonthlySlips.forEach((s) => {
    if (s.monthlySlipNo > maxMonthlyNo) {
      maxMonthlyNo = s.monthlySlipNo;
    }
  });
  const monthlySlipNo = maxMonthlyNo + 1;

  // System-wide overall slip number
  let maxOverallNo = 0;
  allSlips.forEach((s) => {
    if (s.overallSlipNo > maxOverallNo) {
      maxOverallNo = s.overallSlipNo;
    }
  });
  // If starting fresh, we can start from 1 or current max
  const overallSlipNo = maxOverallNo > 0 ? maxOverallNo + 1 : 1;

  // Format YYYY and MM
  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, '0');
  const monthlyStr = monthlySlipNo.toString().padStart(4, '0');
  const overallStr = overallSlipNo.toString().padStart(6, '0');

  const slipId = `HU-${cleanBranchCode}-${yearStr}-${monthStr}-${monthlyStr}-${overallStr}`;

  return {
    slipId,
    year,
    month,
    monthlySlipNo,
    overallSlipNo
  };
}

/**
 * Generates official User ID upon Admin creation or registration approval
 * Format: HU-[BranchCode]-U[6-digit number], e.g. HU-MALIR01-U000245
 */
export function generateUserId(branchCode: string, allUsers: AppUser[]): string {
  const cleanBranchCode = (branchCode || 'MALIR01').toUpperCase().trim();
  
  let maxUserNum = 0;
  allUsers.forEach((u) => {
    if (u.id && u.id.includes('-U')) {
      const parts = u.id.split('-U');
      if (parts[1]) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxUserNum) {
          maxUserNum = num;
        }
      }
    }
  });

  const nextNum = maxUserNum + 1;
  const numStr = nextNum.toString().padStart(6, '0');
  return `HU-${cleanBranchCode}-U${numStr}`;
}
