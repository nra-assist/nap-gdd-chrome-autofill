export type NavLink = {
  href: string;
  label: string;
  subLinks?: NavLink[];
};

export const NAV_LINKS: NavLink[] = [
  { href: "/holdings", label: "Акции" },
  { href: "/dividends", label: "Дивиденти" },
  { href: "/sells", label: "Продажби" },
  { href: "/regulated-sells", label: "Продажби (рег.)" },
  { href: "/interest", label: "Лихва" },
  { href: "/cashback", label: "Кешбек" },
];
