import React from 'react';
import TopBar from './TopBar';

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  );
};