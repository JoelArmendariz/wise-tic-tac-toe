import { FunctionComponent } from 'react';
import LeaderboardModal from '../components/modals/LeaderboardModal';
import RestartGamePromptModal from '@/components/modals/RestartGamePromptModal';

export interface CommonModalProps {
  handleClose: () => void;
}

// Utility type that can be used by a modal component to intersect the CommonModalProps with it's own
export type InjectCommonModalProps<P extends Record<string, unknown> = never> = CommonModalProps & {
  [k in keyof P]: P[k];
};

export const enum Modals {
  LEADERBOARD_MODAL = 'modals/leaderboard',
  RESTART_GAME_MODAL = 'modals/restartGame',
}

export const ModalDisplay: Record<Modals, FunctionComponent<InjectCommonModalProps>> = {
  [Modals.LEADERBOARD_MODAL]: LeaderboardModal,
  [Modals.RESTART_GAME_MODAL]: RestartGamePromptModal,
} as const;
