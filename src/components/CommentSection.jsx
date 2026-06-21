import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  fetchComments,
  postComment,
  deleteComment,
  getMyAlias,
  setMyAlias,
  getMyCommentVote,
  voteOnComment,
} from '../lib/contentStore';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function AliasModal({ onSaved, onCancel }) {
  const [alias, setAlias] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const clean = alias.trim().replace(/^@/, '');
    if (!clean) return;
    setSaving(true);
    setErr('');
    try {
      await setMyAlias(clean);
      onSaved(clean);
    } catch (e2) {
      setErr(e2.message || 'Could not save alias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">Pick your forever alias</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          This is the name shown on your comments. No two people can have the same one. You can change it later from any of your own comments.
        </p>
        <form onSubmit={submit}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-400 font-bold">@</span>
            <input
              autoFocus
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={24}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="yourname"
            />
          </div>
          {err && <p className="text-xs text-red-500 mb-2">{err}</p>}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-full font-semibold text-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save alias'}
            </button>
            <button type="button" onClick={onCancel} className="text-sm font-semibold text-zinc-500 hover:text-zinc-700 px-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CommentSection({ articleSlug }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [aliasPromptMode, setAliasPromptMode] = useState(null); // 'first-post' | 'edit' | null

  const refresh = () => fetchComments(articleSlug).then(setComments).catch(() => {});

  useEffect(() => {
    setLoading(true);
    fetchComments(articleSlug).then(setComments).catch(() => {}).finally(() => setLoading(false));
  }, [articleSlug]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMyUserId(data?.user?.id || null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const alias = await getMyAlias();
      if (!alias) {
        setPosting(false);
        setAliasPromptMode('first-post');
        return;
      }
      await postComment(articleSlug, body.trim());
      setBody('');
      refresh();
    } catch (err) {
      toast.error(err.message || 'Could not post comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleFirstAliasSaved = async () => {
    setAliasPromptMode(null);
    if (!body.trim()) return;
    setPosting(true);
    try {
      await postComment(articleSlug, body.trim());
      setBody('');
      refresh();
    } catch (err) {
      toast.error(err.message || 'Could not post comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleAliasChanged = (newAlias) => {
    setAliasPromptMode(null);
    setComments((prev) => prev.map((c) => (c.user_id === myUserId ? { ...c, currentAlias: newAlias } : c)));
  };

  const handleVote = async (commentId, vote) => {
    try {
      const result = await voteOnComment(commentId, vote);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvotes: result.upvotes, downvotes: result.downvotes } : c))
      );
    } catch {
      toast.error('Could not register vote.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error('Could not delete comment.');
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        Comments {comments.length > 0 && <span className="text-zinc-400 font-normal">({comments.length})</span>}
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Add a comment..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
          />
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="bg-brand-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-brand-700 disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link> to leave a comment. Anyone can vote.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-zinc-400">No comments yet - be the first.</p>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => {
            const myVote = getMyCommentVote(c.id);
            const isMine = c.user_id === myUserId;
            return (
              <div key={c.id} className="flex gap-3">
                <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0">
                  <button
                    onClick={() => handleVote(c.id, 1)}
                    className={`p-1 rounded transition-colors ${myVote === 1 ? 'text-brand-600' : 'text-zinc-400 hover:text-brand-600'}`}
                    aria-label="Upvote"
                  >
                    <ArrowBigUp size={18} fill={myVote === 1 ? 'currentColor' : 'none'} />
                  </button>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{c.upvotes - c.downvotes}</span>
                  <button
                    onClick={() => handleVote(c.id, -1)}
                    className={`p-1 rounded transition-colors ${myVote === -1 ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
                    aria-label="Downvote"
                  >
                    <ArrowBigDown size={18} fill={myVote === -1 ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {isMine ? (
                      <button
                        onClick={() => setAliasPromptMode('edit')}
                        className="font-bold text-sm text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        @{c.currentAlias}
                      </button>
                    ) : (
                      <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">@{c.currentAlias}</span>
                    )}
                    {c.currentAlias !== c.alias_at_post && (
                      <span className="text-xs text-zinc-400">(formerly @{c.alias_at_post})</span>
                    )}
                    <span className="text-xs text-zinc-400">· {timeAgo(c.created_at)}</span>
                    {isMine && (
                      <button onClick={() => handleDelete(c.id)} className="ml-auto text-zinc-400 hover:text-red-500" aria-label="Delete comment">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">{c.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {aliasPromptMode === 'first-post' && (
        <AliasModal onSaved={handleFirstAliasSaved} onCancel={() => setAliasPromptMode(null)} />
      )}
      {aliasPromptMode === 'edit' && (
        <AliasModal onSaved={handleAliasChanged} onCancel={() => setAliasPromptMode(null)} />
      )}
    </div>
  );
}
