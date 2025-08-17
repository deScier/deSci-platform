export { WarningOnChangePage };
export type { WarningOnChangePageProps };

import * as Button from '@components/common/Button/Button';
import * as Dialog from '@components/common/Dialog/Digalog';

import React from 'react';

const WarningOnChangePage: React.FC<WarningOnChangePageProps> = ({
  handleClose,
  handleLeave,
}: WarningOnChangePageProps) => {
  return (
    <React.Fragment>
      <Dialog.Title title="Submission not completed!" onClose={handleClose} />
      <p className="text-base">
        Your document submission is not complete yet. If you leave the page, all your progress will be lost!
      </p>
      <Button.Button variant="primary" onClick={handleClose}>
        Cancel
      </Button.Button>
      <Button.Button variant="outline" onClick={handleLeave}>
        Leave without finishing
      </Button.Button>
    </React.Fragment>
  );
};

interface WarningOnChangePageProps {
  handleClose: () => void;
  handleLeave: () => void;
}
