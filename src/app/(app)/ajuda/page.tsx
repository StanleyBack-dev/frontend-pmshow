import type { Metadata } from "next";
import { PageHeader } from "@/design-system";
import { HelpBrowser } from "@/features/help/components/HelpBrowser";
import { RestartTourButton } from "@/features/help/components/RestartTourButton";

export const metadata: Metadata = { title: "Ajuda" };

// The app's manual: each menu this person can open, with only what applies
// to their permissions (search, cards and "back to top" in HelpBrowser). The
// same content opens from the "?" of each page.
export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="Ajuda"
        description="Como usar cada menu do PM SHOW, de acordo com o que você pode fazer no app."
        actions={<RestartTourButton />}
      />
      <HelpBrowser />
    </>
  );
}
