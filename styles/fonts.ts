import { Inter, Nunito } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const fontMapper = {
  "font-nunito": nunito.variable,
  "font-inter": inter.variable,
} as Record<string, string>;
