'use client';

import { ChevronLeft, ChevronRight, MapPin, User, Archive, Calendar } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setActiveSection: (section: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | 'tourEvents' | 'archivedTourEvent' | 'clients') => void;
  activeSection: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | 'tourEvents' | 'archivedTourEvent' | 'clients' | null;
}

const Sidebar = ({ isCollapsed, toggleSidebar, setActiveSection, activeSection }: SidebarProps) => {
  const handleClick = (section: 'tours' | 'guides' | 'archivedTours' | 'tourEvents' | 'archivedTourEvent' | 'clients') => {
    setActiveSection(section);
  };

  const NavItem = ({
    section,
    icon: Icon,
    label,
  }: {
    section: 'tours' | 'guides' | 'archivedTours' | 'tourEvents' | 'archivedTourEvent' | 'clients';
    icon: React.ComponentType<{ size: number }>;
    label: string;
  }) => (
    <li className="mb-2">
      <button
        onClick={() => handleClick(section)}
        className={`flex items-center text-base px-4 py-2 rounded-lg focus:outline-none transition-all font-medium w-full 
          ${activeSection === section ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
      >
        <span className="mr-3">
          <Icon size={20} />
        </span>
        {!isCollapsed && <span>{label}</span>}
      </button>
    </li>
  );

  return (
    <div
      className={`bg-gray-900 text-gray-100 shadow-lg p-4 transition-all duration-300 h-screen 
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col fixed top-0 left-0 bottom-0 border-r border-gray-800`}
    >
      <button
        onClick={toggleSidebar}
        className="mb-4 flex items-center justify-center w-10 h-10 rounded-lg transition ml-auto"
      >
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      {!isCollapsed && (
        <>
          <h1 className="text-2xl font-semibold text-gray-300 mb-4">
            <span className="text-blue-500">Risper</span> Management
          </h1>
        </>
      )}

      <nav className="flex-grow">
        <ul>
          <NavItem section="tours" icon={MapPin} label="Tours" />
          <NavItem section="guides" icon={User} label="Guides" />
          <NavItem section="archivedTours" icon={Archive} label="Archived Tours" />
          <NavItem section="tourEvents" icon={Calendar} label="Tour Events" />
          <NavItem section="archivedTourEvent" icon={Archive} label="Archived Tour Events" />
          <NavItem section="clients" icon={User} label="Clients" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
