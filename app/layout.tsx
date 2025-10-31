export const metadata = { title: 'EVA', description: 'Memorie autentiche' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="it"><body style={{fontFamily:'system-ui',maxWidth:820,margin:'0 auto',padding:24}}>{children}</body></html>;
}
