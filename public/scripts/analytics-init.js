import { Analytics } from "/scripts/pagetally.js";

const analytics = new Analytics({
  siteId: "fole",
  endpoint: "/api/p",
  respectDNT: true,
});

const fole = {
  track: (name, props) => analytics.track(name, props),
};
window.fole = fole;

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest("[data-analytics-link]");
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const link = anchor.dataset.analyticsLink;
  const location = anchor.dataset.analyticsLocation;
  if (!link || !location) return;

  fole.track("profile_link_click", { link, location });
});
