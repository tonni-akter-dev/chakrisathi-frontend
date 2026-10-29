export const tags = {
  users: "Users",
  reminders: "Reminders",
  notifications: "Notifications",
  chat: "Chat", 
  messages: "Messages",
  supportChat: "SupportChat",
  supportMessages: "SupportMessages",
  reviews: "Reviews",
  payments: "Payments",
  favorites: "Favorites",
  subscription: "Subscription", 
  wallet: "Wallet",
  transactions: "Transactions",
  contacts: "Contacts",
  profile: "Profile",
  supportTickets: "SupportTickets",
 
} as const;

export type Tag = (typeof tags)[keyof typeof tags];

export const tagsArray: Tag[] = Object.values(tags);
