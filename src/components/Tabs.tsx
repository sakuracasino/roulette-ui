import React from 'react';
import classNames from 'classnames';
import slugify from 'slugify';

import './Tabs.scss';

type TabsProps = {
  selectedIndex: number, 
  tabs: {
    content: string;
    onClick?: () => void;
  }[];
};

const Tabs = ({ tabs, selectedIndex }: TabsProps) => (
  <ul className="Tabs">
    {tabs.map((tab, index) => (
      <li
        key={`tab-${slugify(tab.content)}`}
        className={classNames({ 'Tabs__tab': true, 'selected': selectedIndex == index })}
        onClick={tab.onClick}
      >
        {tab.content}
      </li>
    ))}
  </ul>
);

export default Tabs;