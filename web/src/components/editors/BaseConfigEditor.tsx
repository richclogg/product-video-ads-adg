import { useConfig } from '@/context/ConfigContext';
import { FormField } from '@/components/shared/FormField';
import { CONFIG_STRUCTURE } from '@/lib/constants';
import { type BaseConfig, type ConfigField, type ConfigGroup } from '@/lib/types';

export function BaseConfigEditor() {
  const { config, dispatch } = useConfig();
  const { baseConfig } = config;

  const updateField = (group: ConfigGroup, field: ConfigField, value: string) => {
    const next: BaseConfig = {
      ...baseConfig,
      [group]: { ...baseConfig[group], [field]: value },
    };
    dispatch({ type: 'UPDATE_BASE_CONFIG', payload: next });
  };

  return (
    <div className="space-y-6">
      {(Object.entries(CONFIG_STRUCTURE) as [ConfigGroup, ConfigField[]][]).map(
        ([group, fields]) => (
          <div key={group}>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {group}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <FormField
                  key={`${group}-${field}`}
                  label={field}
                  value={baseConfig[group]?.[field] ?? ''}
                  onChange={(e) => updateField(group, field, e.target.value)}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
