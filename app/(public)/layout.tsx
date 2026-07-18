// Public routes use no app shell
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full">{children}</div>;
}
