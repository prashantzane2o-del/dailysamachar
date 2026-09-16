import { StaticPage } from "@/features/home/components/static-page";
import { Button, Input } from "@/shared/ui/primitives";
import { Textarea } from "@/shared/ui/legacy-primitives";
import { getStaticPageMetadata } from "@/shared/lib/page-metadata";
import type { Locale } from "@/i18n/routing";

const description = "Contact the DailySamachar newsroom for news tips, feedback, corrections, accessibility help and partnerships.";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return getStaticPageMetadata({ locale, path: "/contact", title: "Contact DailySamachar Newsroom", description });
}

export default async function Contact({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <StaticPage locale={locale} path="/contact" description={description} eyebrow="Reach the newsroom" title="Contact us.">
      <p>
        For news tips, feedback, corrections or partnership enquiries, use the form below. Sensitive tips should not
        include information that could place anyone at risk.
      </p>
      <p className="border-line bg-soft mt-5 rounded-lg border p-4">
        Newsroom email: {" "}
        <a className="text-signal font-semibold underline underline-offset-4" href="mailto:news@dailysamachar.org">
          news@dailysamachar.org
        </a>
      </p>
      <form className="space-y-4" action="mailto:news@dailysamachar.org" method="post" encType="text/plain">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="contact-name">Your name</label>
          <Input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="contact-email">Email address</label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Email address" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="contact-message">Message</label>
          <Textarea id="contact-message" name="message" placeholder="How can we help?" required />
        </div>
        <p className="text-muted text-sm leading-6">Please do not submit confidential personal information through this form.</p>
        <Button type="submit">Send message</Button>
      </form>
    </StaticPage>
  );
}
