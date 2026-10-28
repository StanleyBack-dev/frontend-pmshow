import { Check } from "lucide-react";
import { sectionsFor, type HelpTopic } from "@/features/help/model/help-topics";
import type { Permission } from "@/shared/contracts/api";

// A topic of the manual, only with what applies to these permissions: what
// it is for, how to use it, rules, who can do what and the notices.
export function HelpTopicContent({
  topic,
  permissions,
}: {
  topic: HelpTopic;
  permissions: readonly Permission[];
}) {
  const sections = sectionsFor(topic, permissions);
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-fg">{topic.tour}</p>
      {sections.map((section) => (
        <section key={section.kind}>
          <h3 className="text-[11px] font-semibold tracking-[0.07em] text-soft uppercase">
            {section.title}
          </h3>
          <ul className="mt-1.5 space-y-1.5">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-fg"
              >
                <Check
                  aria-hidden
                  className="mt-[3px] size-3.5 shrink-0 text-brand-gold-ink"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
