export interface InputBoxEventMap {
  keypress: {
    key: string;
    value: string;
    timestamp: number;
    valueChanged: boolean;
  };
}
