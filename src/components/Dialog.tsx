import React from 'react';
import { Modal } from 'react-responsive-modal';

import 'react-responsive-modal/styles.css';
import './Dialog.scss';
const Dialog = function ({children, open, onCloseModal}) {
  return (
    <Modal open={open} onClose={onCloseModal} center classNames={{root: 'Dialog'}}>
      {children}
    </Modal>
  );
};

export default Dialog;