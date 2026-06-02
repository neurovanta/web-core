const EASE = "cubic-bezier(0.77,0,0.175,1)";
const DUR = "0.52s";

const CX = 22;
const CY = 16;

const C_DARK = "#51463E";
const C_TOP = "#F9F5F0";
const C_MID = "#E2D3C3";

const HL = 22;

export default function MenuIcon({ open, dark = false }: { open: boolean; dark?: boolean }) {
  const tOpen = `stroke 0s 0s`;
  const tClose = `stroke 0s ${DUR}`;
  const tXform = `transform ${DUR} ${EASE} 60ms`;

  // When dark=true (career pages), resting color is C_DARK instead of light colors
  const lineColor = open ? C_DARK : dark ? C_DARK : C_TOP;
  const midColor  = open ? C_DARK : dark ? C_DARK : C_MID;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="32"
      viewBox="0 0 44 32"
      fill="none"
      className="w-[22px] md:w-auto h-[15px] md:h-[20px] 2xl:w-[44px] 2xl:h-[30px]"
      aria-hidden="true"
    >
      <line
        x1={CX - HL} y1={CY} x2={CX + HL} y2={CY}
        strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: lineColor,
          transform: open ? "rotate(45deg)" : `translateY(${1 - CY}px)`,
          transition: open ? `${tOpen}, ${tXform}` : `${tClose}, ${tXform}`,
        }}
      />
      <line
        x1={CX - HL} y1={CY} x2={CX + HL} y2={CY}
        strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: midColor,
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
          transition: open
            ? `stroke 0s 0s, opacity 0.15s ease 0s, transform 0.22s ${EASE} 0s`
            : `stroke 0s ${DUR}, opacity 0.18s ease ${DUR}, transform 0.22s ${EASE} ${DUR}`,
        }}
      />
      <line
        x1={CX - HL} y1={CY} x2={CX + HL} y2={CY}
        strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          stroke: lineColor,
          transform: open ? "rotate(-45deg)" : `translateY(${31 - CY}px)`,
          transition: open ? `${tOpen}, ${tXform}` : `${tClose}, ${tXform}`,
        }}
      />
    </svg>
  );
}