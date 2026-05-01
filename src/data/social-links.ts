export type SocialLinkId = "website" | "github" | "linkedin" | "devto" | "twitter" | "email" | "rss";

export interface SocialLink {
  id: SocialLinkId;
  label: string;
  href: string;
  icon: string;
  external?: boolean;
  trackClicks?: boolean;
}

export const socialLinks: Record<SocialLinkId, SocialLink> = {
  website: {
    id: "website",
    label: "Website",
    href: "/",
    icon: "tabler:world",
  },
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/anfocic",
    icon: "tabler:brand-github",
    external: true,
    trackClicks: true,
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/afocic/",
    icon: "tabler:brand-linkedin",
    external: true,
    trackClicks: true,
  },
  devto: {
    id: "devto",
    label: "DEV",
    href: "https://dev.to/fole",
    icon: "simple-icons:devdotto",
    external: true,
    trackClicks: true,
  },
  twitter: {
    id: "twitter",
    label: "Twitter",
    href: "https://x.com/folezof",
    icon: "tabler:brand-x",
    external: true,
    trackClicks: true,
  },
  email: {
    id: "email",
    label: "Email",
    href: "mailto:andrej@fole.dev",
    icon: "tabler:mail",
    trackClicks: true,
  },
  rss: {
    id: "rss",
    label: "RSS",
    href: "/rss.xml",
    icon: "tabler:rss",
    trackClicks: true,
  },
};

// Toggle which links appear in each part of the site here.
export const heroSocialLinkIds: SocialLinkId[] = ["github", "linkedin", "twitter", "email"];
export const footerSocialLinkIds: SocialLinkId[] = ["github", "linkedin", "twitter", "email", "devto"];

export function getSocialLinks(ids: SocialLinkId[]) {
  return ids.map((id) => socialLinks[id]);
}
