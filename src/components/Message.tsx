import React from 'react';
import classNames from 'classnames';

import './Message.scss';
function Message({className, children, type}: {className?: string, children: any, type?: string}) {
  const classes = {
    'Message': true,
    'Message--error': type === 'error',
    'Message--warning': type === 'warning',
    'Message--info': type === 'info',
    [className || '']: !!className,
  };
  return (
    <div className={classNames(classes)}>
      {children}
    </div>
  )
}

export default Message;