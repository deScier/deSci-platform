export { MobileProfileComponent };

import Profile from '@/components/common/sidebar/profile/profile';
import React from 'react';

/**
 * @title Mobile Profile Component
 * @notice This component renders the mobile view of a user profile
 * @dev This React functional component uses the SidesProps for props input and handles the rendering of the Profile component in a mobile-responsive manner
 */
const MobileProfileComponent: React.FC<{ onClose: (text?: string) => void }> = ({ onClose }: { onClose: (text?: string) => void }) => {
  return (
    <React.Fragment>
      <div className="relative">
        <Profile className="block w-auto" onClose={() => onClose()} />
      </div>
    </React.Fragment>
  );
};
