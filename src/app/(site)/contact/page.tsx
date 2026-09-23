import ContactSection from "@/components/ContactSection";
import NewsletterSection from "@/components/NewsletterSection";
import { settingsService } from "@/server/services/SettingsService";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await settingsService.get();

  return (
    <>
      <ContactSection settings={settings} />
      <NewsletterSection />
    </>
  );
}
