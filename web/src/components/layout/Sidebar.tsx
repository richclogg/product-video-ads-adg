const TABS = [
  { id: 'base-config', label: 'Base Config' },
  { id: 'timing', label: 'Timing' },
  { id: 'placement', label: 'Placement' },
  { id: 'offers', label: 'Offers' },
  { id: 'offers-to-adgroups', label: 'Offers to AdGroups' },
  { id: 'adgroups', label: 'AdGroups' },
  { id: 'json-preview', label: 'JSON Preview' },
  { id: 'upload', label: 'Upload' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 bg-white">
      <ul className="flex flex-col gap-0.5 p-2">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => onTabChange(tab.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 font-medium text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
