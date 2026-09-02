import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const steps: [number, string][] = [
    [60, "s"],
    [60, "min"],
    [24, "h"],
    [30, "d"],
    [12, "m"],
    [Number.POSITIVE_INFINITY, "a"],
  ];
  const labels = ["seg", "min", "h", "d", "m", "a"];
  let value = seconds;
  let unitIndex = 0;
  const divisors = [60, 60, 24, 30, 12];
  for (let i = 0; i < divisors.length; i++) {
    if (value < divisors[i]) break;
    value = Math.floor(value / divisors[i]);
    unitIndex++;
  }
  if (unitIndex === 0 && value < 5) return "agora";
  return `há ${value} ${labels[unitIndex]}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const AVATAR_PALETTE = [
  ["#C1502E", "#F4E3D3"],
  ["#2F3E2E", "#E9EFE6"],
  ["#E3A72B", "#3A2E14"],
  ["#3E6259", "#E6F1EE"],
  ["#7A3B2E", "#F6E6DE"],
  ["#4A5A8F", "#E7EAF5"],
];

export function avatarColors(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CONDITIONS: Record<string, string> = {
  new: "Novo",
  used: "Usado",
  refurbished: "Recondicionado",
};

export const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
