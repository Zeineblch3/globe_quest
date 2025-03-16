'use client';

import { ChevronLeft, ChevronRight, MapPin, User, Archive } from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    setActiveSection: (section: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting') => void;
    activeSection: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | null;
}
  
  

const Sidebar = ({ isCollapsed, toggleSidebar, setActiveSection, activeSection }: SidebarProps) => {
  const handleClick = (section: 'tours' | 'guides' | 'archivedTours'  ) => {
    setActiveSection(section);
  };

  // Reusable NavItem component
  const NavItem = ({
    section,
    icon: Icon,
    label,
  }: {
    section: 'tours' | 'guides' | 'archivedTours'  ;
    icon: React.ComponentType<{ size: number }>;
    label: string;
  }) => (
    <li className="mb-4">
      <button
        onClick={() => handleClick(section)}
        className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${
          activeSection === section
            ? 'text-gray-400 font-bold' // Active section: light gray and bold
            : 'text-gray-600 hover:text-gray-500' // Inactive section: normal gray, darker on hover
        }`}
      >
        {/* Wrap the icon with a span or div to apply the className */}
        <span className="mr-2">
          <Icon size={24} />
        </span>
        {!isCollapsed && <span>{label}</span>}
      </button>
    </li>
  );

  return (
    <div
      className={`bg-gray-900 text-gray-800 shadow-xl p-4 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col fixed top-0 left-0 bottom-0`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition ml-auto"
      >
        {isCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
      </button>

      {/* Title */}
      <h1 className={`${isCollapsed ? 'hidden' : 'block'} text-xl mb-4 text-gray-400`}>
        Management
      </h1>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul>
          <NavItem section="tours" icon={MapPin} label="Tours" />
          <NavItem section="guides" icon={User} label="Guides" />
          <NavItem section="archivedTours" icon={Archive} label="Archived Tours" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
