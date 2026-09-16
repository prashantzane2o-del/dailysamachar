"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send, UserRound } from "lucide-react";

type Comment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

const MAX_COMMENT_LENGTH = 500;

function storageKey(articleId: string) {
  return `dailysamachar:comments:${articleId}`;
}

export function ArticleComments({ articleId, locale = "en" }: { articleId: string; locale?: string }) {
  const isHindi = locale === "hi";
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/comments?postId=${encodeURIComponent(articleId)}`)
      .then(async (response) => (response.ok ? ((await response.json()) as { comments?: Comment[] }) : { comments: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.comments)) setComments(data.comments);
      })
      .catch(() => {
        // Keep previously saved local comments visible if WordPress is temporarily unavailable.
        try {
          const saved = window.localStorage.getItem(storageKey(articleId));
          if (saved && !cancelled) setComments(JSON.parse(saved) as Comment[]);
        } catch {
          // Ignore unavailable browser storage.
        }
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const persist = (nextComments: Comment[]) => {
    setComments(nextComments);
    try {
      window.localStorage.setItem(storageKey(articleId), JSON.stringify(nextComments));
    } catch {
      // Keep the in-memory state when browser storage is blocked.
    }
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim().slice(0, 60);
    const cleanBody = body.trim().slice(0, MAX_COMMENT_LENGTH);

    if (cleanName.length < 2) {
      setError(isHindi ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
      return;
    }
    if (cleanBody.length < 2) {
      setError(isHindi ? "कमेंट थोड़ा बड़ा लिखें।" : "Please write a longer comment.");
      return;
    }

    void fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: articleId, name: cleanName, content: cleanBody }),
    })
      .then(async (response) => {
        const data = (await response.json()) as { comment?: Comment; error?: string };
        if (!response.ok || !data.comment) throw new Error(data.error || "Comment unavailable");
        persist([data.comment, ...comments]);
        setName("");
        setBody("");
        setError("");
      })
      .catch((submitError: unknown) => {
        setError(submitError instanceof Error ? submitError.message : isHindi ? "कमेंट भेजा नहीं जा सका।" : "Comment could not be posted.");
      });
  };

  return (
    <section id="comments-section" className="container-page mt-10 scroll-mt-24" aria-labelledby="comments-heading">
      <div className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-gray-950">
        <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-7">
          <div>
            <p className="kicker text-signal">{isHindi ? "पाठकों की राय" : "Reader voice"}</p>
            <h2 id="comments-heading" className="text-ink mt-1 flex items-center gap-2 text-xl font-bold sm:text-2xl">
              <MessageCircle className="text-signal h-5 w-5" aria-hidden="true" />
              {isHindi ? "कमेंट करें" : "Join the conversation"}
            </h2>
          </div>
          <span className="text-muted text-sm" aria-live="polite">
            {comments.length} {isHindi ? "कमेंट" : comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>

        <form onSubmit={submitComment} className="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)_auto] sm:items-end sm:px-7">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span className="text-ink">{isHindi ? "नाम" : "Name"}</span>
            <span className="relative">
              <UserRound className="text-muted absolute top-3 left-3 h-4 w-4" aria-hidden="true" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                className="border-line bg-soft text-ink focus:ring-signal min-h-11 w-full rounded-xl border py-2.5 pr-3 pl-10 outline-none focus:ring-2"
                placeholder={isHindi ? "आपका नाम" : "Your name"}
                autoComplete="name"
              />
            </span>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span className="text-ink">{isHindi ? "आपका कमेंट" : "Your comment"}</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={MAX_COMMENT_LENGTH}
              rows={2}
              className="border-line bg-soft text-ink focus:ring-signal min-h-11 w-full resize-y rounded-xl border px-3 py-2.5 outline-none focus:ring-2"
              placeholder={isHindi ? "सम्मानजनक टिप्पणी लिखें..." : "Share a respectful comment..."}
            />
          </label>
          <button type="submit" className="bg-signal focus:ring-signal inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white transition-colors hover:bg-red-700 focus:ring-2 focus:outline-none">
            <Send className="h-4 w-4" aria-hidden="true" />
            {isHindi ? "भेजें" : "Post"}
          </button>
          {error && <p className="text-red-700 sm:col-span-3" role="alert">{error}</p>}
        </form>

        <div className="border-line border-t px-5 py-5 sm:px-7">
          {comments.length === 0 ? (
            <p className="text-muted rounded-xl border border-dashed p-5 text-center text-sm">
              {isHindi ? "पहला कमेंट आप करें।" : "Be the first to comment."}
            </p>
          ) : (
            <ul className="grid gap-4" aria-label={isHindi ? "कमेंट सूची" : "Comments list"}>
              {comments.map((comment) => (
                <li key={comment.id} className="bg-soft rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-ink font-bold">{comment.name}</span>
                    <time className="text-muted text-xs" dateTime={comment.createdAt}>
                      {new Intl.DateTimeFormat(isHindi ? "hi-IN" : "en-IN", { dateStyle: "medium" }).format(new Date(comment.createdAt))}
                    </time>
                  </div>
                  <p className="text-muted mt-2 whitespace-pre-wrap text-sm leading-6">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
