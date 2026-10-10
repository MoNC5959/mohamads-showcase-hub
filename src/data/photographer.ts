import type { PersonInfo } from "@/types";

/**
 * Real content only. The source project this was migrated from carried
 * leftover fields (awards, clients, "MFA Photography" education, a stock
 * portrait URL, fake Instagram/Behance links) from the photography template
 * it started life as — those were dropped rather than migrated.
 */
export const photographerInfo: PersonInfo = {
  name: "Mohamad Noor-Chowdhury",
  tagline: "Product and Innovation Professional",
  heroIntroduction: "I turn operational chaos into products people actually use.",
  biography: [
    "If I could describe myself in one word, it would be analytical. I probably annoyed my parents as a kid because I always asked why things were the way they were. I love to question and try to understand if there are better ways to tackle processes. This is something that has defined my entire career, and something I would like to continue.",
    "I went to Temple University for both my undergraduate and graduate degree. I have a B.B.A in Management Information Systems (MIS) and an M.Sc in Digital Innovation in Marketing. To describe my master's program, it would be a concentration of MIS and digital marketing. Every semester had a group project in which we would have to create new product based on different requirements, such as incorporating AI or reviving a legacy brand.",
  ],
  interests: [
    "Outside of work, you'll find me deep in an audiobook, debating NBA trades, or quietly watching an NFL game (huge NFL fantasy addiction). I also spend a suspicious amount of time playing with my cats, who remain unimpressed by my professional accomplishments. When I'm not doing that, I'm probably down a YouTube rabbit hole watching videos about ancient civilizations or the history of some obscure food I've never tried. I'm a devoted gym-goer, which is less about discipline and more about damage control from my baking habit. I have a serious sugar problem and a kitchen to prove it. My dessert repertoire runs the gamut from New York-style cheesecakes and cookies to tiramisu, and yes, there's a gallery to document the damage.",
    "I recently have been teaching myself to Vibe Code! I've been using Claude Code (via VS Code) and Google Stitch to create things I never thought I could on my own. By using Stitch as a wireframe, Claude Code is able to easily understand what I want, which is something that will be amazing to have as a professional skill when presenting to stakeholders.",
    "Then, by using Claude, I've been converting my projects into React and then posting back my Lovable!",
  ],
  location: "Philadelphia, PA. Willing to relocate.",
  email: "mohamad.noorchowdhury@gmail.com",
  phone: "+1 (484) 472-3212",
  linkedin: "https://www.linkedin.com/in/mohamad-noor-chowdhury/",
  github: "https://github.com/MoNC5959",
};
