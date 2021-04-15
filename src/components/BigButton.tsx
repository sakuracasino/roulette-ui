import React from 'react';
import classNames from 'classnames';
import './BigButton.scss';

type BigButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: any;
};

const BigButton = (props: BigButtonProps) => (
  <button {...props} className={classNames(['BigButton', props.className || ''])}>
    {props.children}
  </button>
);

export default BigButton;
