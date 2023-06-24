interface Keypress {
  key: string;
  timestamp: number;
}

export interface CharKeypressLog extends Keypress {
  matched: boolean;
  textCharIndex: number;
}

export interface NonCharKeypressLog extends Keypress {
  nonChar: true;
}

export type KeypressLog = CharKeypressLog | NonCharKeypressLog;

export type CharState =
  | "correct"
  | "incorrect"
  | "cursor-left"
  | "cursor-right";

export type FormattedChar = { char: string; states: CharState[] };

export type FormattedCurrentWord = {
  hasTypo: boolean;
  canTypeMore: boolean;
  wordChars: FormattedChar[];
  trailingSpaceStates: CharState[];
};
