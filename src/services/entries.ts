import type { Comment, HistoryEntry, User } from '../types'

export function shortId(): string {
  return crypto.randomUUID().slice(0, 8)
}

export function historyEntry(actor: User, action: string): HistoryEntry {
  return {
    id: `h-${shortId()}`,
    simulated: false,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    createdAt: new Date().toISOString(),
  }
}

export function makeComment(actor: User, content: string): Comment {
  return {
    id: `c-${shortId()}`,
    simulated: false,
    authorId: actor.id,
    authorName: actor.name,
    authorRole: actor.role,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  }
}
