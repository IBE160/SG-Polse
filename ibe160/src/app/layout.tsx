import "~/styles/globals.css";

import { headers } from "next/headers";
import { TRPCReactProvider } from "~/utils/api";
import { Providers } from "./providers";
import { Header } from "./components/Header";

export const metadata = {
  title: "IBE400 Machine Learning Chatbot",
  description: "Your assistant for the IBE400 Machine Learning course.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider headers={headers()}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
