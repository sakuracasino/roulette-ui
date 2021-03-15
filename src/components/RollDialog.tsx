import React from 'react';
import Dialog from './Dialog';
import RouletteGraphic from './RouletteGraphic';

type RollDialogProps = {
  opened: boolean;
  onClose: () => void;
};

const RollDialog = (props: RollDialogProps) => {
  const { opened, onClose } = props;

  return (
    <Dialog open={opened} onCloseModal={onClose}>
      <div className="RollDialog">
        <div>Confirm Roll</div>
        <></>
      </div>
    </Dialog>
  );
};

export default RollDialog;
