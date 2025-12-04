import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function ChatGPTChatHistorySidebar({
  chats = [],
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onNewChat,
  collapsed = false,
  onToggleCollapsed,
  activeId: activeIdProp = null,
  newChatDisabled = false,
}) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(activeIdProp);
  const [menuFor, setMenuFor] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuFor(null);
      }
    };
    if (menuFor) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuFor]);

  // Sync active selection with parent
  useEffect(() => {
    setActiveId(activeIdProp);
  }, [activeIdProp]);

  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysDiff = (a, b) => Math.floor((startOfDay(a) - startOfDay(b)) / (1000 * 60 * 60 * 24));
  const formatMonth = (d) => d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const toRelative = (date) => {
    const d = toDate(date);
    const now = new Date();
    const diffMs = now - d;
    const sec = Math.round(diffMs / 1000);
    const min = Math.round(sec / 60);
    const hr = Math.round(min / 60);
    const day = Math.round(hr / 24);
    if (sec < 45) return 'just now';
    if (sec < 90) return '1 min ago';
    if (min < 60) return `${min} min ago`;
    if (hr < 24) return `${hr}h ago`;
    if (day === 1) return '1 day ago';
    if (day < 7) return `${day} days ago`;
    const weeks = Math.round(day / 7);
    if (weeks < 5) return `${weeks} wk${weeks > 1 ? 's' : ''} ago`;
    const months = Math.round(day / 30);
    if (months < 12) return `${months} mo ago`;
    const years = Math.round(day / 365);
    return `${years} yr${years > 1 ? 's' : ''} ago`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = Array.isArray(chats) ? [...chats] : [];
    arr.sort((a, b) => toDate(b.timestamp) - toDate(a.timestamp));
    if (!q) return arr;
    return arr.filter((c) => (c.title || '').toLowerCase().includes(q));
  }, [chats, query]);

  const sections = useMemo(() => {
    const result = {};
    const now = new Date();

    filtered.forEach((c) => {
      const d = toDate(c.timestamp);
      const diff = daysDiff(now, d);
      let key = '';
      if (diff === 0) key = 'Today';
      else if (diff === 1) key = 'Yesterday';
      else if (diff > 1 && diff <= 7) key = 'Previous 7 days';
      else key = formatMonth(d);
      if (!result[key]) result[key] = [];
      result[key].push(c);
    });

    const fixedOrder = ['Today', 'Yesterday', 'Previous 7 days'];
    const dynamicMonths = Object.keys(result)
      .filter((k) => !fixedOrder.includes(k))
      .sort((a, b) => new Date(b) - new Date(a));

    const orderedKeys = fixedOrder.filter((k) => result[k]).concat(dynamicMonths);
    return orderedKeys.map((k) => ({ title: k, items: result[k] }));
  }, [filtered]);

  const handleSelect = (id) => {
    setActiveId(id);
    onSelectChat && onSelectChat(id);
  };
  const handleStartRename = (chat) => {
    setMenuFor(null);
    setRenamingId(chat.id);
    setRenameValue(chat.title || '');
  };
  const handleFinishRename = () => {
    if (renamingId && renameValue.trim()) {
      onRenameChat && onRenameChat(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const widthClass = collapsed ? 'w-16' : 'w-72';
  const textVisibility = collapsed ? 'opacity-0 pointer-events-none select-none' : 'opacity-100';
  const iconOnly = collapsed;

  return (
    <aside
      className={[
        'relative h-full border-r border-gray-200 bg-white text-gray-900',
        'flex flex-col transition-all duration-300 ease-in-out',
        widthClass,
      ].join(' ')}
    >
      <div className="p-2 flex items-center gap-2">
        <button
          onClick={() => {
            if (!newChatDisabled) onNewChat && onNewChat();
          }}
          className={[
            'flex items-center gap-2 rounded-md',
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
            'hover:shadow-lg hover:scale-105',
            'px-3 py-2 w-full transition focus:outline-none focus:ring-2 focus:ring-purple-500',
            iconOnly ? 'justify-center' : '',
            newChatDisabled ? 'opacity-50 pointer-events-none hover:scale-100 hover:shadow-none' : '',
          ].join(' ')}
          title="New chat"
          disabled={newChatDisabled}
        >
          <span className={['text-sm font-medium truncate transition', textVisibility].join(' ')}>
            Nouvelle conversation
          </span>
        </button>

        <button
          onClick={onToggleCollapsed}
          className="inline-flex items-center justify-center rounded-md border-2 border-gray-200 bg-white hover:bg-purple-50 active:bg-purple-100 px-2 py-2 text-xs font-medium text-gray-700"
          title={collapsed ? 'Étendre' : 'Replier'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <div className={['px-2 transition-all', collapsed ? 'h-0 overflow-hidden' : 'h-auto'].join(' ')}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="w-full px-3 pr-3 py-2 text-sm rounded-md border-2 border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className={['px-2', collapsed ? 'mt-0' : 'mt-2'].join(' ')}>
        <div className="h-px w-full bg-gray-200" />
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth px-2 py-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-gray-500">
                {section.title}
              </div>
            )}

            <ul className="space-y-1">
              {section.items.map((chat) => {
                const active = activeId === chat.id;
                return (
                  <li key={chat.id} className="group relative">
                    <button
                      onClick={() => handleSelect(chat.id)}
                      title={collapsed ? chat.title : undefined}
                      className={[
                        'w-full flex items-center rounded-md px-3 py-2 transition text-left',
                        active
                          ? 'bg-purple-100/70 border border-purple-200'
                          : 'hover:bg-purple-50',
                      ].join(' ')}
                    >
                      <div className={['min-w-0 flex-1', textVisibility, 'transition'].join(' ')}>
                        {renamingId === chat.id ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={handleFinishRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleFinishRename();
                              if (e.key === 'Escape') {
                                setRenamingId(null);
                                setRenameValue('');
                              }
                            }}
                            className="w-full rounded-sm border-2 border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                          />
                        ) : (
                          <>
                            <div className={['text-sm font-semibold text-gray-900 truncate', active ? 'text-purple-900' : ''].join(' ')}>
                              {chat.title || 'Untitled'}
                            </div>
                            <div className="text-[11px] text-gray-500">{toRelative(chat.timestamp)}</div>
                          </>
                        )}
                      </div>

                      <div
                        className={[
                          'absolute right-1 top-1/2 -translate-y-1/2',
                          collapsed ? 'hidden' : 'flex',
                          'opacity-0 group-hover:opacity-100 transition',
                        ].join(' ')}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuFor(menuFor === chat.id ? null : chat.id);
                          }}
                          className="px-2 py-1 rounded-md hover:bg-purple-100 text-gray-600 text-sm font-bold"
                          aria-label="Open menu"
                        >
                          …
                        </button>
                      </div>
                    </button>

                    {menuFor === chat.id && !collapsed && (
                      <div
                        ref={menuRef}
                        className="absolute right-2 top-9 z-50 w-40 rounded-md border-2 border-gray-200 bg-white shadow-lg"
                      >
                        <button
                          onClick={() => handleStartRename(chat)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-purple-50"
                        >
                          Renommer
                        </button>
                        <div className="h-px bg-gray-200" />
                        <button
                          onClick={() => {
                            setMenuFor(null);
                            onDeleteChat && onDeleteChat(chat.id);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-2 pb-2">
        <div className="h-px w-full bg-gray-200 mb-2" />
        {!collapsed && (
          <div className="px-2 py-1 text-[11px] text-gray-500">
            {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </aside>
  );
}