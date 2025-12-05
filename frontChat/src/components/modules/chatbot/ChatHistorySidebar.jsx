import React, { useMemo, useState } from 'react';
import { Plus, Search, MessageSquare, RefreshCw } from 'lucide-react';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';

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
        ${selected 
          ? 'bg-brand-mint/30 border-brand-mint ring-2 ring-brand-mint/50' 
          : 'bg-white border-brand-grey/40 hover:bg-brand-mint/10 hover:border-brand-mint/60'
        }
        focus:outline-none focus:ring-2 focus:ring-brand-mint`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center 
          ${selected 
            ? 'bg-gradient-to-br from-brand-mint to-brand-accent text-white' 
            : 'bg-gradient-to-br from-brand-slate to-brand-slate/80 text-white'
          }`}>
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold truncate ${selected ? 'text-brand-slate' : 'text-text-primary'}`}>
              {title}
            </p>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {formatTimestamp(chat.updatedAt || chat.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {chat.sourceLabel && (
              <Badge variant="mint" size="sm">
                {chat.sourceLabel}
              </Badge>
            )}
            <p className="text-sm text-text-secondary truncate">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};

const SkeletonItem = () => (
  <div className="px-3 py-3 rounded-xl border border-brand-grey/40 bg-white animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-brand-grey/40" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 bg-brand-grey/40 rounded w-1/2" />
        <div className="h-3 bg-brand-grey/40 rounded w-3/4" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ onNewChat }) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-mint to-brand-accent flex items-center justify-center text-white mb-4 shadow-lg">
      <MessageSquare className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-semibold text-text-primary mb-1">Aucune conversation</h3>
    <p className="text-sm text-text-secondary mb-4">Commence une nouvelle discussion pour la voir apparaître ici.</p>
    <Button
      variant="primary"
      onClick={onNewChat}
      icon={<Plus className="w-4 h-4" />}
    >
      Nouvelle conversation
    </Button>
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
    <aside className={`h-full bg-white border-r border-brand-grey/40 flex flex-col w-full sm:w-80 md:w-96 rounded-xl shadow-card overflow-hidden ${className}`}>
      <div className="p-4 border-b border-brand-grey/40 space-y-3 bg-gradient-to-r from-brand-mint/10 to-brand-surface/10">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Conversations</h2>
          <div className="flex items-center gap-2">
            {onRefreshHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefreshHistory}
                icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
                disabled={refreshing}
              >
                Actualiser
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={onNewChat}
              icon={<Plus className="w-4 h-4" />}
            >
              Nouveau
            </Button>
          </div>
        </div>
        <Input
          placeholder="Rechercher une conversation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth p-2 space-y-2 bg-brand-paper">
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
