'use client';

import React, { useMemo } from 'react';
import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useRegion } from '@/contexts/RegionContext';

interface PromotionProgressProps {
  currentMmr: number;
  // Optional server-provided info for more accurate target
  promotionProgress?: { targetMmr: number; gamesRemaining: number };
  // Visual density
  size?: 'compact' | 'regular';
  // Optional explicit width for compact usage
  width?: number | string;
}

type RegionId = 'am-eu' | 'sea' | string;

interface Threshold {
  name: string;
  min?: number; // inclusive lower bound
  nextAt?: number; // mmr required to reach next rank
}

const EU_THRESHOLDS: Threshold[] = [
  { name: 'Private', min: -Infinity, nextAt: 1340 },
  { name: 'Corporal', min: 1340, nextAt: 1440 },
  { name: 'Sergeant', min: 1440, nextAt: 1500 },
  { name: 'Lieutenant', min: 1500, nextAt: 1570 },
  { name: 'Major', min: 1570, nextAt: 1650 },
  { name: 'Colonel', min: 1650, nextAt: 1830 },
  { name: 'Brigadier General', min: 1830, nextAt: 1900 },
  { name: 'General', min: 1900, nextAt: 2150 },
  { name: '5-Star General', min: 2150, nextAt: 2300 },
  { name: 'Commander-in-chief', min: 2300 },
];

const SEA_THRESHOLDS: Threshold[] = [
  { name: 'Private', min: -Infinity, nextAt: 1340 },
  { name: 'Corporal', min: 1340, nextAt: 1430 },
  { name: 'Sergeant', min: 1430, nextAt: 1490 },
  { name: 'Lieutenant', min: 1490, nextAt: 1560 },
  { name: 'Major', min: 1560, nextAt: 1640 },
  { name: 'Colonel', min: 1640, nextAt: 1840 },
  { name: 'Brigadier General', min: 1840, nextAt: 1900 },
  { name: 'General', min: 1900, nextAt: 2150 },
  { name: '5-Star General', min: 2150, nextAt: 2300 },
  { name: 'Commander-in-chief', min: 2300 },
];

function getRegionThresholds(regionId: RegionId): Threshold[] {
  if (regionId === 'sea') return SEA_THRESHOLDS;
  return EU_THRESHOLDS; // default to AM/EU
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function PromotionProgress({
  currentMmr,
  promotionProgress,
  size = 'regular',
  width,
}: PromotionProgressProps) {
  const { selectedRegion } = useRegion();

  const { percent, targetMmr, label, needsEligibilityNote, useServerTarget } =
    useMemo(() => {
      // Prefer server-provided promotion target if available
      const serverTarget = promotionProgress?.targetMmr;
      if (serverTarget && Number.isFinite(serverTarget)) {
        const percent = clamp((currentMmr / serverTarget) * 100 || 0, 0, 100);
        return {
          percent,
          targetMmr: serverTarget,
          label: `Progress to ${serverTarget} MMR`,
          needsEligibilityNote: false,
          useServerTarget: true,
        };
      }

      // Fallback: compute next threshold from rules
      const thresholds = getRegionThresholds(selectedRegion.id as RegionId);
      // Find bracket containing current MMR
      const bracket = thresholds
        .slice()
        .reverse()
        .find((t) => (t.min ?? -Infinity) <= currentMmr);

      // If somehow no bracket found, avoid rendering
      if (!bracket) {
        return {
          percent: 0,
          targetMmr: undefined,
          label: '',
          needsEligibilityNote: false,
        };
      }

      // If already above highest defined nextAt, we are in/near Generals range
      const target = bracket.nextAt;
      if (!target || currentMmr >= target) {
        return {
          percent: 100,
          targetMmr: target,
          label: target ? `Next rank at ${target} MMR` : 'Max rank reached',
          needsEligibilityNote: (bracket.min ?? 0) >= 1900, // Generals tier and above
          useServerTarget: false,
        };
      }

      const lower = bracket.min ?? 0;
      const denom = Math.max(1, target - lower);
      const progress = clamp(((currentMmr - lower) / denom) * 100, 0, 99.9);

      return {
        percent: progress,
        targetMmr: target,
        label: `Next rank at ${target} MMR`,
        needsEligibilityNote: target >= 1900, // Generals have extra requirements
        useServerTarget: false,
      };
    }, [currentMmr, promotionProgress, selectedRegion.id]);

  if (!Number.isFinite(currentMmr)) return null;

  const barHeight = size === 'compact' ? 6 : 10;
  const barWidth = width ?? undefined;

  const content = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <Box
        sx={{
          width: barWidth,
          flex: barWidth ? '0 0 auto' : '1 1 0%',
          minWidth: 0,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: barHeight,
            borderRadius: 0,
            backgroundColor: 'rgba(255,255,0,0.15)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
              borderRadius: 0,
            },
            margin: '1px',
            outlineOffset: '2px',
            outline: '1px solid rgba(255,255,0,1)',
          }}
        />
      </Box>
      <Typography
        variant={size === 'compact' ? 'caption' : 'body2'}
        color="text.secondary"
        sx={{ whiteSpace: 'nowrap' }}
      >
        {Math.round(percent)}%
      </Typography>
    </Box>
  );

  const tooltip = [
    label,
    useServerTarget && targetMmr ? `Target: ${targetMmr}` : undefined,
    promotionProgress?.gamesRemaining !== undefined
      ? `Games remaining: ${promotionProgress.gamesRemaining}`
      : undefined,
    needsEligibilityNote
      ? 'Generals require eligibility (top 50, games played).'
      : undefined,
  ]
    .filter(Boolean)
    .join(' • ');

  return <Tooltip title={tooltip}>{content}</Tooltip>;
}
