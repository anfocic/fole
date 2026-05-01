---
title: "Three Large Language Models Walk Into a Bar"
description: "It's true, I was the bar."
date: 2026-05-01
draft: true
tags:
  - ai
  - benchmarks
  - open-source
---

*It's not a bar per se but you get the gist.*

As I was looking at my pile of unfinished projects I decided not to finish any of those and rather start something new. I was looking for open source models to try out and stumbled upon [Opencode](https://opencode.ai/).

Currently I use Claude Code and Codex for development because I created a workflow that just works and why fix something that's not broken, but on the other hand I don't want to be tied to corporations. Freedom and that stuff, you know. 

## Meet the contestants

Multiple models are available via Opencode CLI and I have decided to test Kimi K2.6, DeepSeek V4 Pro, MiniMax M2.7 because people say they are good and you have to beleive people on the internet. The test is intentionally simple so take all this with a grain of salt, harder tests will come when the time is right. Limitations are noted in [the technical write-up](https://github.com/anfocic/sandbox/blob/main/blog/sandbox-2026-04-30.md).

All three models used the same specification of what to do and I measured time (yes manually, well on my iphone but still counts), context usage and the most important of all $$$$. 

## The judges

Of course the usual suspects, Codex and Claude are here because they go brrr, for this purpose Opus 4.7 and GPT 5.5 were used and peer review amongst aforementioned open source contestants.

Each judge gets the spec, the rubric, and three blinded filesc randomly shuffled per judge. No test results, no peeking
at other judges. Twelve scorings in total: claude + codex grade all three, each peer grades the two that aren't its own. 


<p class="drumroll"><em><strong>drum roll please</strong></em></p>

## The Results were SHOCKING

No they weren't idk why I said that.

<figure>
  <table>
    <thead>
      <tr><th></th><th>kimi</th><th>deepseek</th><th>minimax</th></tr>
    </thead>
    <tbody>
      <tr><td>hidden tests</td><td>9/9</td><td>9/9</td><td class="lose">8/9</td></tr>
      <tr><td>spec score (median)</td><td class="win">10</td><td>9</td><td>8</td></tr>
      <tr><td>quality (median /20)</td><td class="win">16.5</td><td>16</td><td>14.5</td></tr>
      <tr><td>cost</td><td class="win">$0.03</td><td>$0.07</td><td>$0.04</td></tr>
      <tr><td>tokens</td><td>27.5k</td><td>28.2k</td><td class="win">22.8k</td></tr>
      <tr><td>wall-clock</td><td>6m36s</td><td>5m16s</td><td class="win">2m57s</td></tr>
    </tbody>
  </table>
  <figcaption>I am never gonna financially recover from this.</figcaption>
</figure>






## Mutual respect across competitors 

Neither model favoured itself by tearing down the other. 
Kimi ranked DeepSeek's implementation best. DeepSeek ranked Kimi's best. Well, ain't that cute? 

**Codex gave everyone 8/10**. How convinient of it, might be my fault but lets blame Codex for the sake of the argument. Maybe it was it's day off or something. 

Codex and Claude gave Minimax 16/20 on quality. Peers gave it 12.5. Kimi and DeepSeek — judging blind, no idea whose code they were dunking on — both flagged the same thing: a chunk of code that looks like it's doing its job but quietly isn't.
 
The *experts* read right past it. Two peer models reviewing competitors work caught it cleanly. That's not what I signed up for.


## Personal opinion

I don't have a personal opinion anymore, agents think for me. Why think when no think save brain time. 

Regardless, all these models seem pretty good for coding, they are not at the frontier level but I am more than pleased with their capabilites. If I had to choose favourites (favorite? I really need to decide which english to use) I'd pick Kimi. But that might be biased because of my love for Kimi Raikkonen <3. 


## where dem numbers bro
I deliberately ommited the technical stuff here not to fluff the blog post and keep it short, if you are interested in tech details you can see it [here](https://github.com/anfocic/sandbox/blob/main/blog/sandbox-2026-04-30.md).

The whole framework is in [the repo](https://github.com/anfocic/sandbox).
