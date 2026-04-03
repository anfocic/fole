export const ANALYTICS_EVENTS = {
  blogPostEngaged: "Blog Post Engaged",
  blogPostRead: "Blog Post Read",
  profileLinkClick: "Profile Link Click",
} as const;

export const ANALYTICS_EVENT_SPEC = {
  pageview: {
    source: "Plausible default pageview",
    props: [],
  },
  blogPostEngaged: {
    source: ANALYTICS_EVENTS.blogPostEngaged,
    props: ["slug", "reading_time_minutes"],
  },
  blogPostRead: {
    source: ANALYTICS_EVENTS.blogPostRead,
    props: ["slug", "reading_time_minutes"],
  },
  profileLinkClick: {
    source: ANALYTICS_EVENTS.profileLinkClick,
    props: ["link", "location"],
  },
} as const;
