import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profil } from "@/data/profil";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollLisse from "@/components/ScrollLisse";
import FondCircuits from "@/components/FondCircuits";
import MarqueurDefilement from "@/components/MarqueurDefilement";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-var",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${profil.nom} — ${profil.role} & ${profil.roleSecondaire}`,
    template: `%s — ${profil.nom}`,
  },
  description: profil.accroche,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={mono.variable}
    >
      <body className="min-h-screen antialiased">
        <ScrollLisse />
        <FondCircuits />
        <MarqueurDefilement />
        <Header />
        <main>{children}</main>
        <div id="pied">
          <Footer />
        </div>
      </body>
    </html>
  );
}
