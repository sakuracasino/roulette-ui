import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Modal } from 'react-responsive-modal';

import 'react-responsive-modal/styles.css';
import './Dialog.scss';
import { uniqueId } from 'lodash';

export const useDialogAnimation: () => [string, () => void] = () => {
  const [animationId, setAnimationId] = useState<string>('');
  return [animationId, () => setAnimationId(uniqueId('animation_'))];
};

type DialogProps = {
  children?: React.ReactNode,
  open: boolean,
  onCloseModal: () => void,
  className?: string,
  animation?: string,
}

const Dialog = function ({
  children,
  open,
  onCloseModal,
  className,
  animation
}: DialogProps) {
  const [shakeAnimation, setShakeAnimation] = useState<boolean>(false);
  const removeAnimation = () => setShakeAnimation(false);
  const onShakeEnd = useCallback(() => {
    const modalElement = document.querySelector('.react-responsive-modal-root');
    modalElement?.removeEventListener('animationend', removeAnimation);
    modalElement?.addEventListener('animationend', removeAnimation);
  }, []);

  useEffect(() => {
    if (animation) setShakeAnimation(true);
  }, [animation]);

  const classes: {[key: string]: boolean} = {
    'Dialog': true,
    'Dialog--shake': shakeAnimation,
  };

  if (className) classes[className] = true;

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      classNames={{ root: classNames(classes) }}
      onAnimationEnd={onShakeEnd}
    >
      {children}
    </Modal>
  );
};

export default Dialog;