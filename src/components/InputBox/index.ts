export function isValidChar(char: string) {
  const code = char.charCodeAt(0);
  // from " " to "~"
  return code > 31 && code < 127;
}

export function resetSelection(
  e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) {
  const input = e.target as HTMLInputElement;

  input.selectionStart = input.value.length;
  input.selectionEnd = input.value.length;
}
