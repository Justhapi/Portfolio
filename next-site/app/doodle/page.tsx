import DoodleView from "./DoodleView";

/* Opens from the link emailed with a note: shows the doodle the visitor
   drew. Not linked anywhere on the site and kept out of search. */
export const metadata = {
  title: "A doodle — Kathleen Li",
  robots: { index: false, follow: false },
};

export default function DoodlePage() {
  return <DoodleView />;
}
