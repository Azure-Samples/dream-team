// import React from "react";
import ag from "@/assets/ag.png";
import aAif from "@/assets/azure-aif.png";

export function Footer() {
  return (
    <footer className="bg-muted mt-8">
      <div className="container mx-auto px-4 py-2 text-center text-sm text-muted-foreground">
        <p className="inline">&copy; 2025 MagenticOne showcase powered by </p>
        <img src={ag} alt="Logo" className="w-[18px] inline" />
        <p className="inline">&nbsp;running on </p>
        <img src={aAif} alt="Logo" className="w-[18px] inline" />
        <p className="inline">&nbsp;ver. 20250524.1</p>
      </div>
    </footer>
  );
}
