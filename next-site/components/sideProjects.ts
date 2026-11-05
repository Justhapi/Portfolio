const IMG = "/img/Side_Projects";
const pic = (dir: string, name: string, alt: string) => ({
  sm: `${IMG}/${dir}/web/${name}-sm.webp`,
  lg: `${IMG}/${dir}/web/${name}-lg.webp`,
  alt,
});

export type SideProject = {
  id: string;
  /** Hackathon / event it was made for, if any. */
  event?: string;
  award?: string;
  name: string;
  what: string;
  /** Collaborator credited after `what`, linked to their site. */
  credit?: { name: string; href: string };
  /** Extra links shown under the belt (e.g. a write-up post). */
  links?: { label: string; href: string }[];
  role: string;
  cover: ReturnType<typeof pic>;
  shots: ReturnType<typeof pic>[];
};

/** Side projects, one still star each. Shots run in process order. */
export const SIDE_PROJECTS: SideProject[] = [
  {
    id: "innovateher",
    event: "Innovate/Her Hackathon 2026",
    award: "Best Use of Solana",
    name: "Skintel",
    what: "Skincare Intel App",
    role: "Design Engineer",
    cover: pic("InnovateHer_2026", "Login_Thumbnail", "Skintel login screen"),
    shots: [
      pic("InnovateHer_2026", "References", "Visual references"),
      pic("InnovateHer_2026", "Whiteboarding", "Whiteboard sketches"),
      pic("InnovateHer_2026", "Refined_Sketches", "Refined sketches"),
      pic("InnovateHer_2026", "Login_Thumbnail", "Skintel login screen"),
    ],
  },
  {
    id: "dubstech",
    event: "DubsTech Protothon 2026",
    name: "Constell",
    what: "Anonymous Stories / Messages App",
    role: "Designer",
    cover: pic("DubsTech", "Logo_Thumbnail", "Constell logo"),
    shots: [
      pic("DubsTech", "References", "Visual references"),
      pic("DubsTech", "Crazy_Eights", "Crazy eights sketches"),
      pic("DubsTech", "Wireframe", "Wireframe"),
      pic("DubsTech", "Browse", "Browse screen"),
      pic("DubsTech", "Journal", "Journal screen"),
      pic("DubsTech", "Connections", "Connections screen"),
      pic("DubsTech", "Notification", "Connection notification"),
      pic("DubsTech", "Thank", "Thank-you note screen"),
      pic("DubsTech", "Logo_Thumbnail", "Constell logo"),
    ],
  },
  {
    id: "grubmenu",
    name: "Grubmon Menu",
    what: "Pokemon-themed GRUB boot menu",
    credit: { name: "Hanako Keney", href: "https://www.ev3rshade.com/" },
    links: [{ label: "LinkedIn post", href: "https://lnkd.in/p/gQ_i2fbt" }],
    role: "Designer",
    cover: pic("Grub_Menu", "Grub_Menu_Thumbnail", "Grubmon boot menu"),
    shots: [
      pic("Grub_Menu", "References", "Pokemon game references"),
      pic("Grub_Menu", "Components", "Menu components"),
      pic("Grub_Menu", "Health_Bar", "Health bar and boot entry pieces"),
      pic("Grub_Menu", "Zip_Handoff", "Frames for the handoff"),
      pic("Grub_Menu", "Grub_Menu_Thumbnail", "Grubmon boot menu"),
    ],
  },
];
