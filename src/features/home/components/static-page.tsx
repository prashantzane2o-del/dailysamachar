import { Container, Section } from "@/components/layout/layout";
import { WebPageSchema } from "@/components/seo/webpage-schema";
import type { Locale } from "@/i18n/routing";

export function StaticPage({
  eyebrow,
  title,
  description,
  locale,
  path,
  children,
}: React.PropsWithChildren<{
  eyebrow: string;
  title: string;
  description?: string;
  locale?: Locale;
  path?: string;
}>) {
  return (
    <Section>
      <Container className="max-w-4xl">
        {locale && path && description ? <WebPageSchema locale={locale} path={path} title={title} description={description} /> : null}
        <article aria-labelledby="static-page-title">
          <header className="max-w-3xl">
            <p className="kicker">{eyebrow}</p>
            <h1 id="static-page-title" className="editorial text-ink mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
            {description ? <p className="text-muted mt-5 max-w-2xl text-lg leading-8">{description}</p> : null}
          </header>
          <div className="text-ink mt-8 max-w-3xl space-y-6 text-[1.05rem] leading-8">{children}</div>
        </article>
      </Container>
    </Section>
  );
}
