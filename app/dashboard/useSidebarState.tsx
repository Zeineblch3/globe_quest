
import { useState } from 'react';

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return {
    isCollapsed,
    toggleSidebar
  };
};
