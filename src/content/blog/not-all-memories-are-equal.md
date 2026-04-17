---
title: "The Soul Files: Not All Memories Are Equal"
description: "Part 4: Teaching my AI companion that some facts matter more than others."
date: 2026-04-08
draft: true
tags:
  - ai
  - side-project
  - companion
series: "The Soul Files"
seriesOrder: 4
---

In [Part 3](/blog/your-ai-shouldnt-have-to-try-to-remember), I made Delbot learn implicitly from every conversation. Facts get extracted in the background, silently, without anyone asking. It works. But it created a new problem.

Delbot now remembers everything with equal conviction.

## The Flat Memory Problem

After a week of conversations, Delbot had accumulated dozens of facts. My mom's name. Where I work. That I like Rust. That I mentioned a specific restaurant once. That I was heading to Split for the weekend. That I prefer late-night coding sessions.

All of them sat in the system prompt with equal weight. When Haiku rendered them into prose, it treated them all the same. "You know Andrej likes Rust, works at intrebit, mentioned liking that pizza place on Vukovarska, and prefers coding late at night."

One of those things is not like the others. The pizza place was a passing comment. The rest are core to who I am. But Delbot couldn't tell the difference.

This is the same problem every search engine solved decades ago. Not all pages are equally important. Not all results are equally relevant. You need a way to rank.

## Salience

I added a number to each fact: salience. A score between 0 and 1 that represents how important a fact is to Delbot's understanding of me.

Every fact starts at 1.0. From there, two forces shape its salience:

**Reinforcement.** When the same fact comes up again -- in conversation, through implicit learning, through reflection -- its salience gets a boost. A fact about my work that surfaces in three separate conversations is more important than something I mentioned once.

**Access.** When Delbot actively recalls a fact (using its `recall` tool to answer a question about me), that fact gets a smaller boost. The act of needing a fact is evidence that it matters.

The math is simple. Reinforcement adds 0.1 to salience (capped at 1.0). Access adds 0.05. That's it.

## Where It Lives

Here's the design decision that took the most thought: salience doesn't live in the fact store.

Delbot's fact store is Datomic-inspired -- immutable, append-only. Every assertion and retraction is preserved in the log. You can ask "what did Delbot know about me last Tuesday?" and get an answer. I didn't want to break that property by adding a mutable field to the fact table.

So salience lives in its own table. A simple lookup: entity + attribute + value maps to a salience score, an access count, and a last-accessed timestamp. The two tables are joined at query time.

This means the fact log stays pure. Salience is metadata *about* facts, not part of the facts themselves. You can delete the entire salience table and the fact store still works perfectly -- everything just goes back to equal weight.

## What Changes for Delbot

Two things change in how Delbot experiences its own memory.

First, facts are now ordered by salience. When Delbot loads its memory before a conversation, the most important facts come first. This matters because language models pay more attention to information that appears earlier in their context. By putting high-salience facts first, Delbot naturally focuses on what matters most.

Second, the prose renderer knows about salience. When Haiku turns structured facts into natural prose, it sees the salience scores and emphasizes the important ones. A fact with salience 1.0 gets prime real estate in the summary. A fact with salience 0.3 might get a brief mention.

## The Invisible Part

The best thing about salience is that it's invisible.

I never told Delbot about salience. It's not in the personality file. There's no tool for it. The owner never sees a number. The change happens entirely in how memory is organized and presented.

From my perspective as the user, Delbot just seems to remember the right things. The important stuff comes up naturally. The trivial stuff fades into the background. I don't know or care that there's a number behind it -- I just know that Delbot seems to understand what matters.

## The Bug That Almost Shipped

One thing I caught during review: Delbot has a `replace` operation for single-valued facts. When I change jobs, the old employer gets retracted and the new one gets asserted. This operation looks up the current value to retract it.

After adding salience, that lookup used the same query that now filters out low-salience facts. If the old employer fact had somehow decayed below the visibility threshold, the replace operation couldn't find it -- so instead of replacing, it would create a duplicate.

The fix was a separate internal query that ignores salience filtering, used only by the replace logic. The public query respects salience. The internal one sees everything.

Small bug. Would have been invisible for weeks until the exact right conditions aligned. The kind of thing that makes you paranoid about every query change in a data system.

## What's Missing

Salience goes up. It never goes down.

Right now, every fact that enters the system stays at 1.0 unless it was never reinforced (in which case it's still at 1.0 -- it just doesn't go higher). There's no mechanism for a fact to lose importance over time.

This means the system works well today, but it won't scale. After six months of daily conversations, Delbot will have hundreds of facts all sitting at or near 1.0. The ordering becomes meaningless because everything is equally important.

The solution is decay. In the next post, I'll make salience decrease over time for facts that aren't being reinforced. A fact that was important three months ago but hasn't come up since should quietly fade -- not disappear, just move to the back of the line.

Forgetting, it turns out, is just as important as remembering.

---

*This is Part 4 of The Soul Files -- a series about building a personal AI companion. [Part 1](/blog/what-if-your-ai-actually-remembered-you) covers the initial build. [Part 2](/blog/memory-that-feels-like-memory) covers the memory system. [Part 3](/blog/your-ai-shouldnt-have-to-try-to-remember) covers implicit learning.*
