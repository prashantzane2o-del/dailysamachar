import { StaticPage } from "@/features/home/components/static-page";
import { EmptyState } from "@/components/ui/feedback";
export default function Profile() {
  return (
    <StaticPage eyebrow="Your account" title="Profile">
      <EmptyState
        title="Your profile will appear here"
        description="Connect authentication to manage your reading history, saved stories and newsletter preferences."
      />
    </StaticPage>
  );
}
