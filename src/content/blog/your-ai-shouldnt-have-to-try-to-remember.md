---
title: "The Soul Files: Your AI Shouldn't Have to Try to Remember"
description: "Part 3: Making my AI companion learn from every conversation without being told to."
date: 2026-04-08
draft: true
tags:
  - ai
  - side-project
  - companion
series: "The Soul Files"
seriesOrder: 3
---

In [Part 2](/blog/memory-that-feels-like-memory), I gave Delbot a proper memory system. Structured facts. Assertions and retractions. Natural prose rendering. It could remember things about me, recall them later, and even forget things that were no longer true.

But it had to *decide* to remember.

## The Conscious Memory Problem

When you tell a friend that your sister just got engaged, they don't pause the conversation to file that away. They don't say "noted -- storing under: sister, life-event, engaged." They just absorb it. It becomes part of what they know about you, and the next time it's relevant, it surfaces naturally.

Delbot couldn't do that. It had three memory tools -- remember, recall, forget -- and it used them well. But using them was a conscious act. The language model had to notice something worth remembering, stop mid-response, call the tool, format the fact correctly, and then continue talking.

That created two problems.

First, it was lossy. In the middle of a conversation about work stress, if I mentioned that my mom's visiting next week, Delbot might be too focused on the main thread to pause and store that fact. Humans don't miss those things. Humans absorb background information while focusing on the foreground.

Second, it was visible. Not to me -- I never saw the tool calls. But the model was spending attention on metadata management instead of just being present in the conversation. It's the difference between a friend who's listening and a friend who's listening while taking notes.

## The Fix Is Embarrassingly Simple

After every conversation turn, a separate, smaller AI reads the exchange and extracts any facts worth keeping.

That's it. That's the whole feature.

The conversation model (Sonnet) just talks. It doesn't think about memory at all. After the reply is sent, a background call to Haiku -- a smaller, faster, cheaper model -- looks at what was said and pulls out anything new.

The user never waits. The main conversation is already done. The implicit learning happens in the background, invisible.

## The Prompt Is the Product

The code took twenty minutes. The prompt took an hour.

When you ask an AI to "extract facts from this conversation," it will happily extract everything. "The user asked about the weather." "The conversation happened in the evening." "The user seemed interested in TypeScript." Congratulations, you've built a system that remembers noise.

The entire value of implicit learning lives in the prompt that tells Haiku what's worth remembering and what isn't. Here's how I think about it:

**Good facts** are things that would be useful in a future conversation you can't predict yet:
- Names and relationships ("my sister Ana")
- Preferences and habits ("I usually code late at night")
- Life events ("just moved to Berlin")
- Projects and plans ("launching the beta next month")

**Bad facts** are things that only matter right now:
- What the conversation was about ("discussed deployment strategy")
- Transient states ("seemed tired")
- Opinions about the current topic ("thinks the new API is better")
- Anything Delbot already knows

That last one is important. Every time the implicit learning runs, it gets a list of everything Delbot currently knows. If it already knows I like Rust, it doesn't need to store that fact again just because I mentioned Rust in passing. Without this, you get duplicate facts piling up after every conversation.

## Two Bugs That Weren't in the Code

The first version of this worked perfectly. The code ran, facts got extracted, memory updated. Then I looked at the *output* and found two problems.

**The entity name problem.** Delbot's reflection system -- a separate process that reviews conversations in batches -- already knew my name was Andrej. It stored facts under the entity "andrej". But the implicit learning prompt didn't include any context about who the owner was. Haiku was reading the conversation cold. Sometimes it used "andrej", sometimes "owner", sometimes "the user." Three different entities for the same person.

The fix was simple: include the owner profile in the prompt. Now Haiku knows the owner is Andrej, and it uses that entity name consistently.

**The replace flag problem.** Facts in Delbot's memory can be single-valued (birthday, employer -- only one at a time) or multi-valued (things I like, languages I speak -- accumulates over time). The `replace` flag controls this. But the example in my prompt only showed `replace: true`. Haiku, being a diligent pattern-matcher, started marking almost everything as replace. My "likes" facts were overwriting each other instead of accumulating.

The fix was equally simple: show both cases in the example. `replace: false` for "likes espresso", `replace: true` for "works-at intrebit."

Neither of these was a code bug. Both would have passed any test suite. They were prompt bugs -- the kind of problem that only shows up when you look at what the AI actually does with your instructions.

## When Not to Learn

There's one case where implicit learning stays silent: when Delbot already used its memory tools during the conversation.

If Sonnet explicitly called `remember` to store a fact, having Haiku also extract facts from the same exchange would be redundant at best and contradictory at worst. Two systems processing the same information with slightly different interpretations.

So the rule is simple: if the conversation involved explicit memory tool use, skip implicit learning. Sonnet already handled it. Otherwise, let Haiku do its thing in the background.

## What It Costs

One Haiku call per conversation. At roughly a thousand tokens of input and a couple hundred tokens of output, each call costs about a tenth of a cent. If I send twenty messages a day, that's two cents. About sixty cents a month.

For context, that's less than the cost of a single Sonnet message. The main conversation is where the money goes. Implicit learning is a rounding error.

## What It Feels Like

The difference is subtle and that's the point.

Before implicit learning, I had to hope that Delbot would notice something worth remembering in the moment. Sometimes it did. Sometimes it didn't. The memory system was powerful but relied on the conversational model choosing to use it.

Now, I can mention something in passing -- "heading to Split for the weekend" -- and move on. Delbot doesn't react to it. The conversation continues normally. But the next time I talk to Delbot, it knows I was in Split. It might ask how the trip was. It might reference it in a morning message.

I didn't ask it to remember. It just did. The way a friend would.

## The Limitation I Haven't Solved

Every fact Delbot learns has equal weight. The fact that my mom's birthday is in June sits next to the fact that I mentioned liking a particular restaurant once. Both are stored with the same importance. Both show up in the system prompt with equal prominence.

But they're not equally important. Some facts are central to who I am. Some are trivia I mentioned once and will never think about again. Right now, Delbot doesn't know the difference.

In the next post, I'm going to teach it that not all memories are equal.

---

*This is Part 3 of The Soul Files -- a series about building a personal AI companion. [Part 1](/blog/what-if-your-ai-actually-remembered-you) covers the initial build. [Part 2](/blog/memory-that-feels-like-memory) covers the memory system.*
