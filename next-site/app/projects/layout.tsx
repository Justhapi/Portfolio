import CaseReveal from "@/components/CaseReveal";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CaseReveal />
    </>
  );
}
