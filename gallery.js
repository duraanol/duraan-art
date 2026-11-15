// Every piece on the site lives here. Add a line, drop the (watermarked) image in /images, done.
// Run tools/process_art.py on new originals first: it crops, watermarks and tags them.
// file:     filename inside the images folder
// title:    internal label only (not shown on the site)
// medium:   short note (ink, Procreate, graphite...)
// set:      "featured" (home page + hero rotation) or "flash" (flash page)
// hero:     true to include in the home page rotation
// wide:     true for landscape pieces that should take two grid columns
// w, h:     pixel size of the image (the slideshow sizes its frame to fit, no bars)
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
  { file: "green-hair-black-eye.png", w: 918, h: 1400, title: "Green hair, black eye", medium: "Ink and color", set: "featured", hero: true, headliner: true },
  { file: "cowboy-skull.png", w: 1400, h: 1312, title: "Cowboy skull", medium: "Ink and color", set: "featured", hero: true },
  { file: "android-geisha.png", w: 972, h: 1400, title: "Android geisha", medium: "Ink and color", set: "featured", hero: true },
  { file: "knight-under-a-black-sun.png", w: 1400, h: 918, title: "Knight under a black sun", medium: "Ink and color", set: "featured", hero: true, wide: true },
  { file: "the-rogue.png", w: 1400, h: 918, title: "The rogue", medium: "Ink and color", set: "featured", hero: true, wide: true },
  { file: "dropship.png", w: 1314, h: 1400, title: "Dropship", medium: "Ink and color", set: "featured", hero: true },
  { file: "lady-and-roses.png", w: 1198, h: 1400, title: "Lady and roses", medium: "Ink and color", set: "featured", hero: true },
  { file: "witchs-hat.png", w: 1400, h: 1394, title: "Witch's hat", medium: "Ink and color", set: "featured", hero: true },

  // ---- flash -------------------------------------------------------------
  { file: "flash-sheet-1.png", w: 1050, h: 1400, title: "Flash sheet no. 1", medium: "Ink, 11 designs", set: "flash" },
  { file: "minotaur.png", w: 1256, h: 1400, title: "Minotaur", medium: "Ink", set: "flash" },
  { file: "hand-study.png", w: 912, h: 1400, title: "Hand study", medium: "Ink and grey wash", set: "flash" },
  { file: "knights-helm.png", w: 1060, h: 1390, title: "Knight's helm", medium: "Ink", set: "flash" },
  { file: "hound.png", w: 1280, h: 1400, title: "Hound", medium: "Ink", set: "flash" },
  { file: "lute.png", w: 1246, h: 1248, title: "Lute", medium: "Ink", set: "flash" },
  { file: "anvil.png", w: 1202, h: 1054, title: "Anvil", medium: "Ink", set: "flash" },
  { file: "raven.png", w: 660, h: 1306, title: "Raven", medium: "Ink", set: "flash" },
  { file: "broken-sword.png", w: 1216, h: 1258, title: "Broken sword", medium: "Ink", set: "flash" },
  { file: "winged-axe.png", w: 690, h: 1314, title: "Winged axe", medium: "Ink", set: "flash" },
  { file: "scroll-and-horn.png", w: 880, h: 868, title: "Scroll and horn", medium: "Ink", set: "flash" },
  { file: "tower.png", w: 480, h: 1266, title: "Tower", medium: "Ink", set: "flash" },
  { file: "square-and-trowel.png", w: 928, h: 816, title: "Square and trowel", medium: "Ink", set: "flash" },
  { file: "key-ring.png", w: 592, h: 566, title: "Key ring", medium: "Ink", set: "flash" },
];
