import React, { useState } from 'react';
import { Clock, Database, Settings, Folder, FolderOpen, Plus, Edit2, PanelLeftClose, PanelLeftOpen, Trash2, Check, X } from 'lucide-react';
import { useApiStore } from '@/hooks/useApiStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const Sidebar = () => {
  const {
    collections,
    history,
    environments,
    activeEnvironmentId,
    activeCollection,
    tabs,
    activeTabId,
    loadFromCollection,
    addCollection,
    renameCollection,
    setActiveCollection,
    setActiveEnvironment,
    updateEnvironmentVariable,
    deleteEnvironmentVariable,
    addEnvironmentVariable,
    removeFromCollection,
    updateTab
  } = useApiStore();

  const [activeSection, setActiveSection] = useState<'collections' | 'history' | 'environments'>('collections');
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingVariable, setEditingVariable] = useState<{envId: string, key: string} | null>(null);
  const [newVariableKey, setNewVariableKey] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');
  const [addingVariable, setAddingVariable] = useState<string | null>(null);

  // ... (all your functions like toggleCollection, handleCreateCollection, etc. remain the same)

  const groupedCollections = collections.reduce((acc, request) => {
    const collection = request.collection || 'Default';
    if (!acc[collection]) acc[collection] = [];
    acc[collection].push(request);
    return acc;
  }, {} as Record<string, typeof collections>);

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'text-green-600 bg-green-50',
      POST: 'text-blue-600 bg-blue-50',
      PUT: 'text-orange-600 bg-orange-50',
      DELETE: 'text-red-600 bg-red-50',
      PATCH: 'text-purple-600 bg-purple-50'
    };
    return colors[method as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const collectionNames = Object.keys(groupedCollections);
  if (collectionNames.length === 0) {
    collectionNames.push('Default');
  }

  return (
      <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
        <div className="p-4 border-b border-gray-200 shrink-0">
          {/* Header content... */}
        </div>

        {!isCollapsed && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="border-b border-gray-200 shrink-0 overflow-hidden">
                {/* Tabs content... */}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {/* ... other sections ... */}

                  {activeSection === 'environments' && (
                      <div className="space-y-4">
                        <div className="text-xs text-gray-500 mb-3">Environment variables can be used in requests with {`{{variable_name}}`} syntax</div>
                        {environments.map(env => (
                            <div key={env.id} className={`space-y-2 p-3 rounded-lg border ${activeEnvironmentId === env.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-gray-900">{env.name}</div>
                                <div className="flex items-center gap-2">
                                  {activeEnvironmentId === env.id ? <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Active</span> : <Button variant="outline" size="sm" onClick={() => handleUseEnvironment(env.id)} className="h-6 text-xs">Use This</Button>}
                                  <Button variant="outline" size="sm" onClick={() => handleResetEnvironment(env.id)} className="h-6 text-xs text-red-600 hover:text-red-700">Reset</Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(env.variables).map(([key, value]) => (
                                    <div key={key} className="env-row flex items-center gap-2 text-sm"> {/* <-- 1. CLASS ADDED HERE */}
                                      {editingVariable?.envId === env.id && editingVariable?.key === key ? (
                                          <>
                                            <Input value={key} disabled className="h-7 text-xs font-mono flex-1" />
                                            <Input value={newVariableValue || value} onChange={(e) => setNewVariableValue(e.target.value)} onBlur={() => handleVariableEdit(env.id, key, newVariableValue || value)} onKeyDown={(e) => { if (e.key === 'Enter') handleVariableEdit(env.id, key, newVariableValue || value); else if (e.key === 'Escape') setEditingVariable(null); }} className="h-7 text-xs font-mono flex-1" autoFocus />
                                          </>
                                      ) : (
                                          <>
                                            <span className="text-gray-600 font-mono text-xs flex-1 truncate">{key}:</span>
                                            <span className="text-gray-900 font-mono text-xs flex-1 truncate">{value}</span>
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingVariable({ envId: env.id, key }); setNewVariableValue(value); }} className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100"><Edit2 className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleVariableDelete(env.id, key)} className="h-6 w-6 shrink-0 opacity-60 hover:opacity-100 text-red-600"><Trash2 className="h-3 w-3" /></Button>
                                          </>
                                      )}
                                    </div>
                                ))}
                                {addingVariable === env.id ? (
                                    <div className="env-row flex items-center gap-2"> {/* <-- 2. CLASS ADDED HERE */}
                                      <Input placeholder="Key" value={newVariableKey} onChange={(e) => setNewVariableKey(e.target.value)} className="h-7 text-xs font-mono flex-1" />
                                      <Input placeholder="Value" value={newVariableValue} onChange={(e) => setNewVariableValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddVariable(env.id); else if (e.key === 'Escape') setAddingVariable(null); }} className="h-7 text-xs font-mono flex-1" />
                                      <Button size="sm" onClick={() => handleAddVariable(env.id)} className="h-7 px-2 shrink-0">Add</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => setAddingVariable(env.id)} className="w-full h-7 text-xs">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Variable
                                    </Button>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
              </ScrollArea>
            </div>
        )}
      </div>
  );
};