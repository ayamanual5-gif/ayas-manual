import AboutSection from "@/components/AboutSection";
import { settingsService } from "@/server/services/SettingsService";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await settingsService.get();
  return <AboutSection imageUrl={settings.aboutImageUrl} />;
}
