import React from 'react';

/**
 *@title useIconRenderer Hook
 *@notice This hook is used to map a string key to a corresponding ReactNode (icon). It provides a method `renderIcon` that takes a key and returns the corresponding icon from the provided icon mapping. If no icon is found for the key, it returns null.
 *
 *@param iconMapping - An object where the keys are the names of the icons and the values are the corresponding ReactNode.
 *
 *@returns object - Returns an object with a `renderIcon` method. This method takes a string key as a parameter and returns the corresponding icon from the provided icon mapping. If no icon is found for the key, it returns null.
 */

type IconMapping = { [key: string]: React.ReactNode };

export const useIconRenderer = (iconMapping: IconMapping) => {
  const renderIcon = React.useCallback(
    (key: string) => {
      if (typeof iconMapping === 'object' && iconMapping !== null) {
        return iconMapping[key] || null;
      }
      return null;
    },
    [iconMapping]
  );

  return { renderIcon };
};
