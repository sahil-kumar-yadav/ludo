import { COLORS } from "@/lib/board-constants";

export function makeToken() {
  return { pos: null, inHome: true, finished: false };
}

export function getInitialTokens() {
  return {
    [COLORS.RED]: Array(4).fill(0).map(makeToken),
    [COLORS.GREEN]: Array(4).fill(0).map(makeToken),
    [COLORS.YELLOW]: Array(4).fill(0).map(makeToken),
    [COLORS.BLUE]: Array(4).fill(0).map(makeToken),
  };
}