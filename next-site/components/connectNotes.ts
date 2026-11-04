/** Where a visitor's note goes when they press send: a Web3Forms access
 *  key (free at web3forms.com, made with the email you want notes sent
 *  to). It's meant to be public, so it's fine in the site's code. While
 *  it's empty, sending only plays the animation and nothing is delivered. */
export const NOTES_INBOX_KEY = "929afaab-fcd5-4c46-9353-909db6a2d876";

/** Notes visitors left in the Connect night sky, after you approve them.
 *  Shooting stars and "read everyone's notes" both read from this list.
 *  Add one per approved note (oldest first):
 *    { from: "Maya", date: "11/4/26", text: "loved the kiosk case study" },
 *  Leave `from` as "" if someone didn't give a name. */
export type VisitorNote = { from: string; date: string; text: string };

export const NOTES: VisitorNote[] = [];
