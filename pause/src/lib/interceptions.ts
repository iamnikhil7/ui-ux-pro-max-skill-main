import { MessagingStyle } from "./types";

export interface AppInterception {
  app: string;
  baseMessage: string;
  category: "TRIGGER" | "WATCH" | "SAFE";
  defaultActive: boolean;
}

export const APP_INTERCEPTIONS: AppInterception[] = [
  // Food Delivery - TRIGGER
  { app: "DoorDash", baseMessage: "Before you order \u2014 is this hunger or habit?", category: "TRIGGER", defaultActive: true },
  { app: "Uber Eats", baseMessage: "You've ordered 4 times this week. Is tonight different?", category: "TRIGGER", defaultActive: true },
  { app: "Grubhub", baseMessage: "Pause for 60 seconds. What are you actually feeling right now?", category: "TRIGGER", defaultActive: true },
  { app: "Postmates", baseMessage: "Before you order \u2014 check what's already in the fridge.", category: "TRIGGER", defaultActive: true },
  { app: "Instacart", baseMessage: "Before you fill the cart \u2014 check what's already in the fridge.", category: "TRIGGER", defaultActive: true },
  // Social Media
  { app: "Instagram", baseMessage: "Before you scroll \u2014 take 3 deep breaths.", category: "TRIGGER", defaultActive: true },
  { app: "TikTok", baseMessage: "Before you scroll \u2014 take 3 deep breaths.", category: "TRIGGER", defaultActive: true },
  { app: "Twitter/X", baseMessage: "Before you open \u2014 what were you looking for?", category: "WATCH", defaultActive: false },
  { app: "Facebook", baseMessage: "Before you scroll \u2014 what are you hoping to find?", category: "WATCH", defaultActive: false },
  { app: "YouTube", baseMessage: "Before you play \u2014 is this rest or avoidance?", category: "WATCH", defaultActive: false },
  // Shopping
  { app: "Amazon", baseMessage: "Before you check out \u2014 will you still want this in 48 hours?", category: "TRIGGER", defaultActive: true },
  { app: "Target", baseMessage: "Pause before adding to cart. Want vs. need?", category: "WATCH", defaultActive: false },
  { app: "Walmart", baseMessage: "Take a breath. You can always come back.", category: "WATCH", defaultActive: false },
  // Entertainment
  { app: "Netflix", baseMessage: "Before you play \u2014 when did you plan to stop?", category: "WATCH", defaultActive: false },
  { app: "Spotify", baseMessage: "Going in? That's okay. Just be intentional.", category: "SAFE", defaultActive: false },
  // Health & Fitness - SAFE
  { app: "Strava", baseMessage: "", category: "SAFE", defaultActive: false },
  { app: "MyFitnessPal", baseMessage: "", category: "SAFE", defaultActive: false },
];

export function getStyledMessage(baseMessage: string, style: MessagingStyle, appName: string): string {
  if (!baseMessage) return "";
  switch (style) {
    case "Tough Love":
      return `You said you wanted to change. Opening ${appName} again \u2014 is this that?`;
    case "Data-Driven":
      return baseMessage;
    case "Gentle Nudge":
      return `Hey. ${baseMessage.replace("Before you", "Before you go \u2014 check in with yourself.")}`;
    case "Balanced":
    default:
      return baseMessage;
  }
}
