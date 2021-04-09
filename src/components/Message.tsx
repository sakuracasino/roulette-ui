import React from 'react';
import classNames from 'classnames';

import './Message.scss';
function Message({children, type}: {children: any, type?: string}) {
  const classes = {
    'Message': true,
    'Message--error': type === 'error',
    'Message--warning': type === 'warning',
    'Message--info': type === 'info',
  };
  return (
    <div className={classNames(classes)}>
      {children}
    </div>
  )
}

export default Message;