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

  const handleAddVariable = (envId: string) => {
    if (newVariableKey.trim()) {
      addEnvironmentVariable(envId, newVariableKey.trim(), newVariableValue.trim());
      setNewVariableKey('');
      setNewVariableValue('');
      setAddingVariable(null);
    } else {
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
              url: baseUrlEntry ? baseUrlEntry[1] as string : '',
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
    const env = environments.find(e => e.id === envId);
    if (env) {
      Object.keys(env.variables).forEach(key => {
        if (key !== 'base_url' && key !== 'api_key') {
          deleteEnvironmentVariable(envId, key);
        } else {
          updateEnvironmentVariable(envId, key, key === 'base_url' ? 'https://api.example.com' : 'your_api_key_here');
        }
      });
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

  const groupedCollections = collections.reduce((acc, request) => {
    const collection = request.collection || 'Default';
    if (!acc[collection]) acc[collection] = [];
    acc[collection].push(request);
    return acc;
  }, {} as Record<string, any[]>);

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
      POST: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
      PUT: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950',
      DELETE: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
      PATCH: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950'
    };
    return colors[method as keyof typeof colors] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  };

  const collectionNames = Object.keys(groupedCollections);
  if (collectionNames.length === 0) {
    collectionNames.push('Default');
  }

  return (
      <div className={`h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && <h2 className="text-lg font-semibold">API Nexus</h2>}
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          {!isCollapsed && (
              <div className="mb-3">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Active Collection</label>
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
              <div className="border-b border-gray-200 dark:border-zinc-800 shrink-0 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex min-w-max">
                    {[
                      { id: 'collections', label: 'Collections', icon: Database },
                      { id: 'history', label: 'History', icon: Clock },
                      { id: 'environments', label: 'Environments', icon: Settings }
                    ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveSection(id as any)} className={`flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeSection === id ? 'text-primary border-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'}`}>
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
                        {Object.keys(groupedCollections).length === 0 ? (
                            <div className="text-center py-8">
                              <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No saved requests</p>
                              <p className="text-xs text-gray-400 mt-1">Save requests to organize them here</p>
                            </div>
                        ) : (
                            Object.entries(groupedCollections).map(([collectionName, requests]) => (
                                <div key={collectionName} className="space-y-1">
                                  <div className="group table w-full table-fixed">
                                    <div className="table-row">
                                      <div className="table-cell">
                                        <button
                                            onClick={() => handleCollectionClick(collectionName)}
                                            className={`flex items-center w-full p-1 text-sm font-medium rounded-md transition-colors text-left ${
                                                activeCollection === collectionName ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                                            }`}
                                        >
                                          <Folder className="h-4 w-4 mr-2 shrink-0" />
                                          {editingCollection === collectionName ? (
                                              <div className="flex items-center flex-1 gap-1">
                                                <Input type="text" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCollection(collectionName, newCollectionName); else if (e.key === 'Escape') setEditingCollection(null); }} className="flex-1 bg-transparent border-primary/50 rounded px-1 py-0.5 text-xs min-w-0" autoFocus />
                                                <button onClick={() => handleRenameCollection(collectionName, newCollectionName)} className="p-0.5 hover:bg-muted rounded"><Check className="h-3 w-3 text-green-600" /></button>
                                                <button onClick={() => setEditingCollection(null)} className="p-0.5 hover:bg-muted rounded"><X className="h-3 w-3 text-red-600" /></button>
                                              </div>
                                          ) : (
                                              <>
                                                <span className="truncate">{collectionName}</span>
                                                <span className="ml-auto pl-2 text-xs text-muted-foreground">{requests.length}</span>
                                              </>
                                          )}
                                        </button>
                                      </div>
                                      {editingCollection !== collectionName && (
                                          <div className="table-cell w-14 text-right align-middle">
                                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button variant="ghost" size="icon" onClick={() => startEditingCollection(collectionName)} className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                                              {collectionName !== 'Default' && <Button variant="ghost" size="icon" onClick={() => handleDeleteCollection(collectionName)} className="h-6 w-6 text-destructive"><Trash2 className="h-3 w-3" /></Button>}
                                            </div>
                                          </div>
                                      )}
                                    </div>
                                  </div>
                                  {expandedCollections.has(collectionName) && (
                                      <div className="ml-4 pl-2 border-l border-gray-200 dark:border-zinc-700 space-y-1 mt-1">
                                        {requests.map(request => (
                                            <div key={request.id} className="group table w-full table-fixed">
                                              <div className="table-row">
                                                <div className="table-cell">
                                                  <button onClick={() => loadFromCollection(request)} className="flex items-center w-full px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors">
                                                    <span className={`w-14 text-center text-[10px] font-bold py-0.5 rounded ${getMethodColor(request.method)}`}>{request.method}</span>
                                                    <div className="ml-2 flex-1 text-left min-w-0">
                                                      <div className="font-medium truncate text-xs">{request.name}</div>
                                                    </div>
                                                  </button>
                                                </div>
                                                <div className="table-cell w-8 align-middle text-right">
                                                  <Button variant="ghost" size="icon" onClick={() => removeFromCollection(request.id)} className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                                </div>
                                              </div>
                                            </div>
                                        ))}
                                      </div>
                                  )}
                                </div>
                            ))
                        )}
                      </div>
                  )}
                  {activeSection === 'history' && (
                      <div className="space-y-1">
                        {history.length === 0 ? (
                            <div className="text-center py-8">
                              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No request history</p>
                              <p className="text-xs text-gray-400 mt-1">Your recent requests will appear here</p>
                            </div>
                        ) : (
                            history.map((request, index) => (
                                <button
                                    key={`history-${request.id}-${request.timestamp}-${index}`}
                                    onClick={() => loadFromCollection(request)}
                                    className="w-full text-left p-2 hover:bg-muted/50 rounded-md transition-colors"
                                >
                                  <div className="table w-full table-fixed">
                                    <div className="table-row">
                                      <div className="table-cell w-20 align-top">
                              <span className={`inline-block w-16 text-center px-2 py-0.5 text-xs font-mono rounded shrink-0 ${getMethodColor(request.method)}`}>
                                {request.method}
                              </span>
                                      </div>
                                      <div className="table-cell align-top text-xs pl-2">
                                        <div className="font-medium truncate text-sm">{request.name || 'Untitled Request'}</div>
                                        <div className="text-muted-foreground truncate">{request.url}</div>
                                        <div className="text-muted-foreground/80 mt-1 text-[10px]">{new Date(request.timestamp).toLocaleString()}</div>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                            ))
                        )}
                      </div>
                  )}
                  {activeSection === 'environments' && (
                      <div className="space-y-4">
                        <div className="text-xs text-muted-foreground mb-3">Environment variables can be used in requests with {`{{variable_name}}`} syntax</div>
                        {environments.map(env => (
                            <div key={env.id} className={`space-y-2 p-3 rounded-lg border ${activeEnvironmentId === env.id ? 'border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50' : 'border-gray-200 dark:border-zinc-800'}`}>
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{env.name}</h3>
                                <div className="flex items-center gap-2">
                                  {activeEnvironmentId === env.id ? (
                                      <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">Active</span>
                                  ) : (
                                      <Button variant="outline" size="sm" onClick={() => handleUseEnvironment(env.id)} className="h-7 text-xs px-3">Use This</Button>
                                  )}
                                  <Button variant="ghost" size="sm" onClick={() => handleResetEnvironment(env.id)} className="h-7 text-xs px-2 text-red-500 hover:text-red-500 hover:bg-red-500/10">Reset</Button>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                {Object.entries(env.variables).map(([key, value]) => (
                                    <div key={key} className="group table w-full table-fixed">
                                      {editingVariable?.envId === env.id && editingVariable?.key === key ? (
                                          <div className="table-row">
                                            <div className="table-cell pr-2">
                                              <Input value={key} disabled className="h-7 text-xs font-mono w-full" />
                                            </div>
                                            <div className="table-cell">
                                              <Input value={newVariableValue || String(value)} onChange={(e) => setNewVariableValue(e.target.value)} onBlur={() => handleVariableEdit(env.id, key, newVariableValue || String(value))} onKeyDown={(e) => { if (e.key === 'Enter') handleVariableEdit(env.id, key, newVariableValue || String(value)); else if (e.key === 'Escape') setEditingVariable(null); }} className="h-7 text-xs font-mono w-full" autoFocus />
                                            </div>
                                          </div>
                                      ) : (
                                          <div className="table-row">
                                            <div className="table-cell text-muted-foreground font-mono text-xs truncate pr-2">{key}:</div>
                                            <div className="table-cell font-mono text-xs truncate">{String(value)}</div>
                                            <div className="table-cell w-14 text-right">
                                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingVariable({ envId: env.id, key }); setNewVariableValue(String(value)); }} className="h-6 w-6"><Edit2 className="h-3 w-3" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleVariableDelete(env.id, key)} className="h-6 w-6 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                              </div>
                                            </div>
                                          </div>
                                      )}
                                    </div>
                                ))}
                                {addingVariable === env.id ? (
                                    <div className="env-row flex items-center gap-2">
                                      <Input placeholder="Key" value={newVariableKey} onChange={(e) => setNewVariableKey(e.target.value)} className="h-7 text-xs font-mono flex-1" />
                                      <Input placeholder="Value" value={newVariableValue} onChange={(e) => setNewVariableValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddVariable(env.id); }} className="h-7 text-xs font-mono flex-1" />
                                      <Button size="sm" onClick={() => handleAddVariable(env.id)} className="h-7 px-2 shrink-0">Add</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => setAddingVariable(env.id)} className="w-full h-7 text-xs mt-2">
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