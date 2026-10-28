"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { Button, Modal, buttonClasses } from "@/design-system";
import { HelpTopicContent } from "@/features/help/components/HelpTopicContent";
import { topicForPath } from "@/features/help/model/help-topics";
import { useViewer } from "@/features/layout/components/ViewerContext";

// The "?" next to each page title: everything about that page (what it is
// for, how to use it, rules, permissions and notices) in a dialog. Pages
// without a topic in the manual show nothing.
export function PageHelpButton() {
  const pathname = usePathname();
  const viewer = useViewer();
  const [open, setOpen] = useState(false);
  const topic = topicForPath(pathname);
  if (!topic || !viewer) return null;
  const Icon = topic.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ajuda: ${topic.title}`}
        title="Como usar esta página"
        className="grid size-8 shrink-0 place-items-center rounded-full text-soft transition-colors hover:bg-accent-soft hover:text-accent"
      >
        <CircleHelp aria-hidden className="size-[18px]" />
      </button>
      {open && (
        <Modal
          open
          size="lg"
          onClose={() => setOpen(false)}
          icon={<Icon className="size-5" />}
          title={`Ajuda · ${topic.title}`}
          footer={
            <>
              <Link
                href="/ajuda"
                onClick={() => setOpen(false)}
                className={buttonClasses("secondary")}
              >
                Ver toda a ajuda
              </Link>
              <Button onClick={() => setOpen(false)}>Entendi</Button>
            </>
          }
        >
          <HelpTopicContent topic={topic} permissions={viewer.permissions} />
        </Modal>
      )}
    </>
  );
}
