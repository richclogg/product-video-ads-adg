import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Sidebar, type TabId } from '@/components/layout/Sidebar';
import { useConfig } from '@/context/ConfigContext';
import { BaseConfigEditor } from '@/components/editors/BaseConfigEditor';
import { TimingEditor } from '@/components/editors/TimingEditor';
import { PlacementEditor } from '@/components/editors/PlacementEditor';
import { OffersEditor } from '@/components/editors/OffersEditor';
import { OffersToAdGroupsEditor } from '@/components/editors/OffersToAdGroupsEditor';
import { AdGroupsEditor } from '@/components/editors/AdGroupsEditor';
import { JsonPreview } from '@/components/json/JsonPreview';
import { UploadPanel } from '@/components/upload/UploadPanel';

const TAB_LABELS: Record<TabId, string> = {
  'base-config': 'Base Config',
  timing: 'Timing',
  placement: 'Placement',
  offers: 'Offers',
  'offers-to-adgroups': 'Offers to AdGroups',
  adgroups: 'AdGroups',
  'json-preview': 'JSON Preview',
  upload: 'Upload',
};

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'base-config':
      return <BaseConfigEditor />;
    case 'timing':
      return <TimingEditor />;
    case 'placement':
      return <PlacementEditor />;
    case 'offers':
      return <OffersEditor />;
    case 'offers-to-adgroups':
      return <OffersToAdGroupsEditor />;
    case 'adgroups':
      return <AdGroupsEditor />;
    case 'json-preview':
      return <JsonPreview />;
    case 'upload':
      return <UploadPanel />;
  }
}

interface EditorPageProps {
  onSave?: () => Promise<void>;
  onBack?: () => void;
}

export function EditorPage({ onSave, onBack }: EditorPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('base-config');
  const { config, dispatch } = useConfig();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          {/* Top bar: config name, save, back */}
          <div className="mb-4 flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                &larr; Back
              </button>
            )}
            <input
              type="text"
              value={config.name}
              onChange={(e) =>
                dispatch({ type: 'SET_NAME', payload: e.target.value })
              }
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-lg font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {onSave && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>

          <h2 className="mb-4 text-xl font-semibold">
            {TAB_LABELS[activeTab]}
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <TabContent tab={activeTab} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
