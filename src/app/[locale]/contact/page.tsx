import { StaticPage } from "@/features/home/components/static-page";
import { Button, Input } from "@/shared/ui/primitives";
import { Textarea } from "@/shared/ui/legacy-primitives";
export default function Contact() {
  return (
    <StaticPage eyebrow="Reach the newsroom" title="Contact us.">
      <p>
        For news tips, feedback, corrections or partnership enquiries, use the form below. Sensitive tips should not
        include information that could place anyone at risk.
      </p>
      <form className="space-y-4">
        <Input placeholder="Your name" />
        <Input type="email" placeholder="Email address" />
        <Textarea placeholder="How can we help?" />
        <Button type="submit">Send message</Button>
      </form>
    </StaticPage>
  );
}
