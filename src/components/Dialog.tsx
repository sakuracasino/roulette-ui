import React from 'react';
import { Modal } from 'react-responsive-modal';

import 'react-responsive-modal/styles.css';
const Dialog = function ({children, open, onCloseModal}) {
  return (
    <Modal open={open} onClose={onCloseModal} center>
      {children}
    </Modal>
  );
};

export default Dialog;