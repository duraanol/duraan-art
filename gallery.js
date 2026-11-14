// Every piece on the site lives here. Add a line, drop the (watermarked) image in /images, done.
// Run tools/process_art.py on new originals first: it crops, watermarks and tags them.
// file:     filename inside the images folder
// title:    shown in the slideshow, on hover and in the lightbox
// medium:   short note (ink, Procreate, graphite...)
// set:      "featured" (home page + hero rotation) or "flash" (flash page)
// hero:     true to include in the home page rotation
// wide:     true for landscape pieces that should take two grid columns
// bg:       optional backdrop color for the hero frame (defaults to paper white)
window.SITE = {
  commissions: "open",          // "open" or "closed" — drives the stamp on the home page
  heroSeconds: 6,               // how long each hero slide stays up
  instagram: "https://www.instagram.com/duraan.art/",
  email: "hello@duraan.art",
  // Paste a Formspree form endpoint here (https://formspree.io, free) and the
  // request form submits silently. Empty = it opens a pre-filled email instead.
  formEndpoint: "",
  // Paste a Buttondown embed URL here (https://buttondown.com, free under 100
  // subscribers): https://buttondown.com/api/emails/embed-subscribe/YOURNAME
  // Empty = the join button opens a pre-filled email instead.
  newsletterAction: "",
};

window.GALLERY = [
  // ---- featured ----------------------------------------------------------
  { file: "green-hair-black-eye.png", title: "Green hair, black eye", medium: "Ink and color", set: "featured", hero: true, headliner: true, bg: "#8a3a1e" },
  { file: "cowboy-skull.png", title: "Cowboy skull", medium: "Ink and color", set: "featured", hero: true },
  { file: "android-geisha.png", title: "Android geisha", medium: "Ink and color", set: "featured", hero: true, bg: "#e6d2b4" },
  { file: "knight-under-a-black-sun.png", title: "Knight under a black sun", medium: "Ink and color", set: "featured", hero: true, wide: true, bg: "#d8c9b0" },
  { file: "the-rogue.png", title: "The rogue", medium: "Ink and color", set: "featured", hero: true, wide: true, bg: "#f3dcbc" },
  { file: "dropship.png", title: "Dropship", medium: "Ink and color", set: "featured", hero: true },
  { file: "lady-and-roses.png", title: "Lady and roses", medium: "Ink and color", set: "featured", hero: true },
  { file: "witchs-hat.png", title: "Witch's hat", medium: "Ink and color", set: "featured", hero: true },

  // ---- flash -------------------------------------------------------------
  { file: "flash-sheet-1.png", title: "Flash sheet no. 1", medium: "Ink, 11 designs", set: "flash" },
  { file: "minotaur.png", title: "Minotaur", medium: "Ink", set: "flash" },
  { file: "hand-study.png", title: "Hand study", medium: "Ink and grey wash", set: "flash" },
  { file: "knights-helm.png", title: "Knight's helm", medium: "Ink", set: "flash" },
  { file: "hound.png", title: "Hound", medium: "Ink", set: "flash" },
  { file: "lute.png", title: "Lute", medium: "Ink", set: "flash" },
  { file: "anvil.png", title: "Anvil", medium: "Ink", set: "flash" },
  { file: "raven.png", title: "Raven", medium: "Ink", set: "flash" },
  { file: "broken-sword.png", title: "Broken sword", medium: "Ink", set: "flash" },
  { file: "winged-axe.png", title: "Winged axe", medium: "Ink", set: "flash" },
  { file: "scroll-and-horn.png", title: "Scroll and horn", medium: "Ink", set: "flash" },
  { file: "tower.png", title: "Tower", medium: "Ink", set: "flash" },
  { file: "square-and-trowel.png", title: "Square and trowel", medium: "Ink", set: "flash" },
  { file: "key-ring.png", title: "Key ring", medium: "Ink", set: "flash" },
];
