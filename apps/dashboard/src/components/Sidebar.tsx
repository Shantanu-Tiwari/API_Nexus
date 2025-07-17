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

  const toggleCollection = (collection: string) => {
    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collection)) {
        newSet.delete(collection);
      } else {
        newSet.add(collection);
      }
      return newSet;
    });
  };

  const handleCreateCollection = () => {
    const collectionCount = Object.keys(groupedCollections).length;
    const newName = `Collection ${collectionCount + 1}`;
    addCollection(newName);
    setActiveCollection(newName);
    toggleCollection(newName);
  };

  const handleRenameCollection = (oldName: string, newName: string) => {
    if (newName && newName.trim() && newName !== oldName) {
      renameCollection(oldName, newName.trim());
      if (activeCollection === oldName) {
        setActiveCollection(newName.trim());
      }
    }
    setEditingCollection(null);
    setNewCollectionName('');
  };

  const handleDeleteCollection = (collectionName: string) => {
    const requestsToDelete = collections.filter(req => req.collection === collectionName);
    requestsToDelete.forEach(req => removeFromCollection(req.id));
    if (activeCollection === collectionName) {
      const remainingCollections = Object.keys(groupedCollections).filter(name => name !== collectionName);
      setActiveCollection(remainingCollections.length > 0 ? remainingCollections[0] : 'Default');
    }
  };

  const startEditingCollection = (collectionName: string) => {
    setEditingCollection(collectionName);
    setNewCollectionName(collectionName);
  };

  const handleCollectionClick = (collectionName: string) => {
    if (activeCollection === collectionName) {
      toggleCollection(collectionName);
    } else {
      setActiveCollection(collectionName);
      if (!expandedCollections.has(collectionName)) {
        toggleCollection(collectionName);
      }
    }
  };

  const handleVariableEdit = (envId: string, key: string, value: string) => {
    updateEnvironmentVariable(envId, key, value);
    setEditingVariable(null);
    setNewVariableValue('');
  };

  const handleVariableDelete = (envId: string, key: string) => {
    deleteEnvironmentVariable(envId, key);
  };

  const handleAddVariable = (envId: string) => {
    if (newVariableKey.trim() && newVariableValue.trim()) {
      addEnvironmentVariable(envId, newVariableKey.trim(), newVariableValue.trim());
      setNewVariableKey('');
      setNewVariableValue('');
      setAddingVariable(null);
    } else {
      setNewVariableKey('');
      setNewVariableValue('');
      setAddingVariable(null);
    }
  };

  const handleUseEnvironment = (environmentId: string) => {
    setActiveEnvironment(environmentId);
    if (activeTabId) {
      const env = environments.find(e => e.id === environmentId);
      if (env && Object.keys(env.variables).length > 0) {
        const currentTab = tabs.find(t => t.id === activeTabId);
        if (currentTab) {
          const varEntries = Object.entries(env.variables);
          const baseUrlEntry = varEntries.find(([key]) => key.toLowerCase().includes('url') || key.toLowerCase().includes('host'));
          updateTab(activeTabId, {
            request: {
              ...currentTab.request,
              url: baseUrlEntry ? baseUrlEntry[1] : '',
              headers: Object.fromEntries(
                  varEntries
                      .filter(([key]) => !key.toLowerCase().includes('url') && !key.toLowerCase().includes('host'))
                      .map(([key, value]) => [key, value])
              )
            }
          });
        }
      }
    }
  };

  const handleResetEnvironment = (envId: string) => {
    updateEnvironmentVariable(envId, 'base_url', 'https://api.example.com');
    updateEnvironmentVariable(envId, 'api_key', 'your_api_key_here');
    const env = environments.find(e => e.id === envId);
    if (env) {
      Object.keys(env.variables).forEach(key => {
        if (key !== 'base_url' && key !== 'api_key') {
          deleteEnvironmentVariable(envId, key);
        }
      });
    }
  };

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
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">API Nexus</h2>}
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          {!isCollapsed && (
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Active Collection</label>
                <Select value={activeCollection} onValueChange={setActiveCollection}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionNames.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          )}
        </div>

        {!isCollapsed && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="border-b border-gray-200 shrink-0 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex min-w-max">
                    {[
                      { id: 'collections', label: 'Collections', icon: Database },
                      { id: 'history', label: 'History', icon: Clock },
                      { id: 'environments', label: 'Environments', icon: Settings }
                    ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveSection(id as any)} className={`flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeSection === id ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'}`}>
                          <Icon className="h-4 w-4 mr-2" />
                          {label}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {activeSection === 'collections' && (
                      <div className="space-y-2">
                        <Button onClick={handleCreateCollection} variant="outline" size="sm" className="w-full mb-3">
                          <Plus className="h-4 w-4 mr-2" />
                          New Collection
                        </Button>
                        {/* Collections content */}
                      </div>
                  )}
                  {activeSection === 'history' && (
                      <div className="space-y-2">
                        {/* History content */}
                      </div>
                  )}
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
                                    <div key={key} className="flex items-center gap-2 text-sm">
                                      {editingVariable?.envId === env.id && editingVariable?.key === key ? (
                                          <>
                                            <Input value={key} disabled className="h-7 text-xs font-mono flex-1 min-w-0" />
                                            <Input value={newVariableValue || value} onChange={(e) => setNewVariableValue(e.target.value)} onBlur={() => handleVariableEdit(env.id, key, newVariableValue || value)} onKeyDown={(e) => { if (e.key === 'Enter') handleVariableEdit(env.id, key, newVariableValue || value); else if (e.key === 'Escape') setEditingVariable(null); }} className="h-7 text-xs font-mono flex-1 min-w-0" autoFocus />
                                          </>
                                      ) : (
                                          <>
                                            <span className="text-gray-600 font-mono text-xs min-w-0 flex-1 truncate">{key}:</span>
                                            <span className="text-gray-900 font-mono text-xs min-w-0 flex-1 truncate">{value}</span>
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingVariable({ envId: env.id, key }); setNewVariableValue(value); }} className="h-6 w-6 opacity-60 hover:opacity-100"><Edit2 className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleVariableDelete(env.id, key)} className="h-6 w-6 opacity-60 hover:opacity-100 text-red-600"><Trash2 className="h-3 w-3" /></Button>
                                          </>
                                      )}
                                    </div>
                                ))}
                                {addingVariable === env.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input placeholder="Key" value={newVariableKey} onChange={(e) => setNewVariableKey(e.target.value)} className="h-7 text-xs font-mono flex-1 min-w-0" />
                                      <Input placeholder="Value" value={newVariableValue} onChange={(e) => setNewVariableValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddVariable(env.id); else if (e.key === 'Escape') setAddingVariable(null); }} className="h-7 text-xs font-mono flex-1 min-w-0" />
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