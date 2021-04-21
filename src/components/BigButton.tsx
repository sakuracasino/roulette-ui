import React from 'react';
import classNames from 'classnames';
import './BigButton.scss';

type BigButtonProps = {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: any;
};

const BigButton = (props: BigButtonProps) => {
  const domProps = {
    ...props,
    disabled: props.disabled || props.loading,
    className: classNames(['BigButton', props.className || '']),
  };
  delete domProps['loading'];
  return (
    <button {...domProps}>
      {props.loading ? <div className="loader"></div> : props.children}
    </button>
  );
};

export default BigButton;
