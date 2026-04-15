"use client";

import { forwardRef } from "react";

const ContainerAnchor = forwardRef<HTMLDivElement>((_, ref) => {
    return <div ref={ref} className="container pointer-events-none invisible h-0" />;
});

ContainerAnchor.displayName = "ContainerAnchor";
export default ContainerAnchor;
