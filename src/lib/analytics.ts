export const ANALYTICS_EVENTS = {
  blogPostEngaged: "blog_post_engaged",
  blogPostRead: "blog_post_read",
  profileLinkClick: "profile_link_click",
} as const;

export const ANALYTICS_EVENT_SPEC = {
  pageview: {
    source: "pagetally auto pageview",
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
