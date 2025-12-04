import React, { useMemo, useState } from 'react';
import { Plus, Search, MessageSquare, RefreshCw } from 'lucide-react';
import Input from '@components/common/Input';

const formatTimestamp = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  try {
    return sameDay
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString();
  } catch {
    return d.toISOString().slice(0, 10);
  }
};

const ChatListItem = ({ chat, selected, onClick }) => {
  const title = chat.topic || chat.title || 'Nouvelle conversation';
  const subtitle = chat.preview || chat.lastMessage || chat.status || 'Aucun message';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-xl transition border
        ${selected ? 'bg-purple-50 border-purple-200 ring-2 ring-purple-200' : 'bg-white border-transparent hover:bg-gray-50'}
        focus:outline-none focus:ring-2 focus:ring-purple-400`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center 
          ${selected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}>
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold truncate ${selected ? 'text-purple-900' : 'text-gray-900'}`}>
              {title}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTimestamp(chat.updatedAt || chat.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {chat.sourceLabel && (
              <span className="text-[10px] uppercase tracking-wide text-purple-600 font-semibold">
                {chat.sourceLabel}
              </span>
            )}
            <p className="text-sm text-gray-600 truncate">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};

const SkeletonItem = () => (
  <div className="px-3 py-3 rounded-xl border border-transparent bg-white animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-200" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ onNewChat }) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4">
      <MessageSquare className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-semibold text-gray-900 mb-1">Aucune conversation</h3>
    <p className="text-sm text-gray-600 mb-4">Commence une nouvelle discussion pour la voir apparaître ici.</p>
    <button
      type="button"
      onClick={onNewChat}
      className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md transform hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <Plus className="w-4 h-4 mr-2" />
      Nouvelle conversation
    </button>
  </div>
);

const ChatHistorySidebar = ({
  chats = [],
  selectedChatId,
  onSelectChat = () => {},
  onNewChat = () => {},
  className = '',
  loading = false,
  onRefreshHistory = null,
  refreshing = false
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Array.isArray(chats) ? [...chats] : [];
    list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    if (!q) return list;
    return list.filter((c) =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.lastMessage || '').toLowerCase().includes(q)
    );
  }, [chats, query]);

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col w-full sm:w-80 md:w-96 ${className}`}>
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <div className="flex items-center gap-2">
            {onRefreshHistory && (
              <button
                type="button"
                onClick={onRefreshHistory}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            )}
            <button
              type="button"
              onClick={onNewChat}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md transform hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </button>
          </div>
        </div>
        <Input
          placeholder="Rechercher une conversation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth p-2 space-y-2">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </>
        ) : filtered.length === 0 ? (
          <EmptyState onNewChat={onNewChat} />
        ) : (
          filtered.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              selected={chat.id === selectedChatId}
              onClick={() => onSelectChat && onSelectChat(chat.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;