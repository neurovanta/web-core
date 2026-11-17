"use client";

import { RiExternalLinkLine } from "react-icons/ri";

interface ViewOnSiteButtonProps {
  /** Frontend path, e.g. "/solutions/my-solution". Disabled when empty. */
  href?: string | null;
  /** Hidden items are not reachable on the website; shown with a hint. */
  isHidden?: boolean;
  size?: number;
}

/**
 * Opens an item's public page in a new tab. Used inside clickable list rows,
 * so it stops the click from also opening the CMS editor.
 */
export default function ViewOnSiteButton({
  href,
  isHidden = false,
  size = 20,
}: ViewOnSiteButtonProps) {
  if (!href) {
    return (
      <span
        title="No website link yet (add a slug first)"
        className="cursor-not-allowed text-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <RiExternalLinkLine size={size} />
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={
        isHidden
          ? "View on website (currently hidden, may not be visible to visitors)"
          : "View on website"
      }
      aria-label="View on website"
      className={`cursor-pointer transition-all hover:scale-110 ${
        isHidden
          ? "text-gray-400 hover:text-gray-600"
          : "text-[#9C8257] hover:text-secondary"
      }`}
    >
      <RiExternalLinkLine size={size} />
    </a>
  );
}
