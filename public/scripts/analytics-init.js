import { Analytics } from "/scripts/pagetally.js";

const analytics = new Analytics({
  siteId: "fole",
  endpoint: "/api/p",
  respectDNT: true,
});

window.pagetally = analytics;

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest("[data-analytics-link]");
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const link = anchor.dataset.analyticsLink;
  const location = anchor.dataset.analyticsLocation;
  if (!link || !location) return;

  analytics.track("Profile Link Click", { link, location });
});
