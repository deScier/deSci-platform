import React, { useEffect } from 'react';

/**
 * @dev Initializes the useLimitCharacters hook with an optional initial value.
 * @param initialValue The initial value of the input or textarea.
 * @return An object containing the current length of the input and the characterLimit function.
 */
export const useLimitCharacters = (initialValue: string = '') => {
  /** @dev State to track the length of the input. */
  const [length, setLength] = React.useState(initialValue.replace(/\s/g, '').length);

  /** @dev Effect to update length state when initialValue changes. */
  useEffect(() => {
    setLength(initialValue.replace(/\s/g, '').length);
  }, [initialValue]);

  /**
   * @dev Function to enforce character limit on input or textarea.
   * @param e Event object representing the input event.
   * @param onInput Function to call when input is within the limit.
   * @param limit Maximum number of characters allowed.
   */
  const characterLimit = ({ e, onInput, limit }: CharacterLimit) => {
    /** @dev Extract the value from the event's current target. */
    const value = e.currentTarget.value;

    /** @dev Check if the length is within the limit and call onInput, else truncate the value. */
    if (value.length <= limit - 1) {
      onInput(e);
    } else {
      e.currentTarget.value = value.substring(0, limit - 1);
    }

    /** @dev Update the length state with the current length of the input. */
    setLength(value.length);
  };

  return { length, characterLimit };
};

/**
 * @title Hook useLimitCharacters
 * @notice This hook is used to limit the number of characters in an input or textarea element.
 * @dev The hook manages the character count of an input or textarea element, ensuring it does not exceed a specified limit.
 */
interface CharacterLimit {
  e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>;
  onInput: (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => void;
  limit: number;
}
