import {
  Bluesky,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Mastodon,
  Medium,
  Threads,
  Twitter,
  X,
  Youtube,
} from "./icons";

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  medium: Medium,
  bluesky: Bluesky,
};

type SocialIconProps = {
  kind: keyof typeof components;
  href: string | undefined;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "size-4 md:size-5",
  md: "size-4 md:size-5",
  lg: "size-6",
};

const SocialIcon = ({ kind, href, size = "md" }: SocialIconProps) => {
  if (
    !href ||
    (kind === "mail" &&
      !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null;

  const SocialSvg = components[kind];

  const sizeValue = sizeMap[size];

  return (
    <a
      className="text-muted-foreground text-sm transition hover:text-foreground"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-muted-foreground hover:text-foreground ${sizeValue}`}
      />
    </a>
  );
};

export default SocialIcon;
