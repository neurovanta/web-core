const EASE = "cubic-bezier(0.77,0,0.175,1)";
const DUR = "0.52s";

// cx, cy = centre of the SVG canvas — all rotations pivot here
const CX = 22;
const CY = 16;

// Colours
const C_DARK = "#51463E"; // open state (secondary)
const C_TOP = "#F9F5F0";
const C_MID = "#E2D3C3";

// Half-length of each line (x goes 0→44, so half = 22)
const HL = 22;

export default function MenuIcon({ open }: { open: boolean }) {
  const tOpen = `stroke 0s 0s`;
  const tClose = `stroke 0s ${DUR}`;
  const tXform = `transform ${DUR} ${EASE} 60ms`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="32"
      viewBox="0 0 44 32"
      fill="none"
      className="w-auto h-[20px] 2xl:w-[44px] 2xl:h-[30px]"
      aria-hidden="true"
    >
      {/* Top line: rests at y=1, slides to centre + rotates 45° */}
      <line
        x1={CX - HL}
        y1={CY}
        x2={CX + HL}
        y2={CY}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: open ? C_DARK : C_TOP,
          transform: open ? "rotate(45deg)" : `translateY(${1 - CY}px)`,
          transition: open ? `${tOpen}, ${tXform}` : `${tClose}, ${tXform}`,
        }}
      />

      {/* Mid line: fades + collapses to nothing */}
      <line
        x1={CX - HL}
        y1={CY}
        x2={CX + HL}
        y2={CY}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: open ? C_DARK : C_MID,
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
          transition: open
            ? `stroke 0s 0s, opacity 0.15s ease 0s, transform 0.22s ${EASE} 0s`
            : `stroke 0s ${DUR}, opacity 0.18s ease ${DUR}, transform 0.22s ${EASE} ${DUR}`,
        }}
      />

      {/* Bottom line: rests at y=31, slides to centre + rotates -45° */}
      <line
        x1={CX - HL}
        y1={CY}
        x2={CX + HL}
        y2={CY}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: open ? C_DARK : C_TOP,
          transform: open ? "rotate(-45deg)" : `translateY(${31 - CY}px)`,
          transition: open ? `${tOpen}, ${tXform}` : `${tClose}, ${tXform}`,
        }}
      />
    </svg>
  );
}
