import { Inter, Nunito, Roboto } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const fontMapper = {
  "font-nunito": nunito.variable,
  "font-inter": inter.variable,
  "font-roboto": roboto.variable,
} as Record<string, string>;
