import "~/styles/globals.css";

import { headers } from "next/headers";
import { TRPCReactProvider } from "~/utils/api";

export const metadata = {
  title: "IBE160 Chatbot",
  description: "Your assistant for the IBE160 course.",
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
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
