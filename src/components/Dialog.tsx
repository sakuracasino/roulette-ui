import React from 'react';
import classNames from 'classnames';
import { Modal } from 'react-responsive-modal';

import 'react-responsive-modal/styles.css';
import './Dialog.scss';

type DialogProps = {
  children?: React.ReactNode,
  open: boolean,
  onCloseModal: () => void,
  className?: string,
}

const Dialog = function ({children, open, onCloseModal, className}: DialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      classNames={{ root: classNames(['Dialog', className || '']) }}
    >
      {children}
    </Modal>
  );
};

export default Dialog;