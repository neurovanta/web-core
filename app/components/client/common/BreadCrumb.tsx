const EXISTING_PAGES = ["/", "/about"];

interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav aria-label="Breadcrumb" className="h-[50px] flex justify-center items-center">
      <ol className="flex items-center">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isClickable = !isLast && EXISTING_PAGES.includes(crumb.href);

          return (
            <li key={index} className="flex items-center tracking-[-0.03em]">
              {index > 0 && (
                <span
                  className="inline-block rounded-full mx-[10px] bg-[#D9D9D9] w-[7px] h-[7px]"
                />
              )}

              {isLast ? (
                <span
                  className="font-semibold text-description text-[#D9D9D9]"
                >
                  {crumb.label}
                </span>
              ) : isClickable ? (
                <a
                  href={crumb.href}
                  className="font-normal cursor-pointer opacity-70 text-[#D9D9D9] text-description"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="font-normal opacity-70 cursor-default text-[#D9D9D9] text-description">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
