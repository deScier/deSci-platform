'use client';
/**
 * @title ProgressBar Component
 * @notice A component to show a global progress bar on top of the page. It displays progress on navigation events and finishes when the navigation event is done.
 * @dev This component uses NProgress for the progress bar and listens for click events on anchor tags and state changes in the history. It also cleans up the MutationObserver and restores the original pushState when the component is unmounted.
 */
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

NProgress.configure({ showSpinner: false });

const ProgressBar: React.FC = () => {
  const height = '2px';
  const color = '#70468C';

  const progressBarStyles = `
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: ${color};
      position: fixed;
      z-index: 99999;
      top: 0;
      left: 0;
      width: 100%;
      height: ${typeof height === 'string' ? height : `${height}px`};
    }
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
      opacity: 1.0;
      transform: rotate(3deg) translate(0px, -4px);
    }
  `;
  /**
   * @notice On component mount, adds event listeners and proxy to the window history pushState. On component unmount, disconnects mutation observer and restores the original pushState.
   * @dev Cleanup is performed to prevent memory leaks and side effects.
   */
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      if (targetUrl.startsWith(window.location.origin) && targetUrl !== window.location.href) {
        NProgress.start();
      }
    };

    const handleMutation: MutationCallback = (mutationsList, observer) => {
      const anchorElements = document.querySelectorAll('a');
      anchorElements.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    const originalPushState = window.history.pushState;

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target: any, thisArg: any, argArray: any[]) => {
        NProgress.done();
        return target.apply(thisArg, argArray);
      },
    });

    return () => {
      mutationObserver.disconnect();
      window.history.pushState = originalPushState;
    };
  }, []);

  return <style>{progressBarStyles}</style>;
};

export default ProgressBar;
