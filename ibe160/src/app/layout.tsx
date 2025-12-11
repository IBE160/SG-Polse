import "~/styles/globals.css";

import { headers } from "next/headers";
import { TRPCReactProvider } from "~/utils/api";

export const metadata = {
  title: "IBE400 Machine Learning Chatbot",
  description: "Your assistant for the IBE400 Machine Learning course.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider headers={await headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
