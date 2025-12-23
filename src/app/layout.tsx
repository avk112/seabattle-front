import type { Metadata } from 'next';
import '../index.scss';
import { Flex } from 'antd';

export const metadata: Metadata = {
  title: 'Sea Battle',
  description: 'Sea battle game on sockets'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Flex className="app">{children}</Flex>
      </body>
    </html>
  );
}
