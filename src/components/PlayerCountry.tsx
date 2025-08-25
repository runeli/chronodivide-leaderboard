import Image from "next/image";
import React from "react";

export type CountryName =
  | "America"
  | "Korea"
  | "France"
  | "Germany"
  | "Great Britain"
  | "Libya"
  | "Iraq"
  | "Cuba"
  | "Russia"
  | "Random";

interface PlayerCountryProps {
  countryId?: number;
  width?: number;
  height?: number;
}

const filenameByCountry: Record<CountryName, string> = {
  America: "america.png",
  Korea: "korea.png",
  France: "france.png",
  Germany: "germany.png",
  "Great Britain": "gb.png",
  Libya: "libya.png",
  Iraq: "iraq.png",
  Cuba: "cuba.png",
  Russia: "russia.png",
  Random: "random.png",
};

// Temporary mapping; update IDs when API mapping is finalized
const countryIdToName: Record<number, CountryName> = {
  0: "America",
  1: "Korea",
  2: "France",
  3: "Germany",
  4: "Great Britain",
  5: "Libya",
  6: "Iraq",
  7: "Cuba",
  8: "Russia",
};

function resolveCountryName(countryId?: number): CountryName | undefined {
  if (countryId == null) return undefined;
  return countryIdToName[countryId];
}

export default function PlayerCountry({ countryId, width = 47, height = 23 }: PlayerCountryProps) {
  const resolvedName = resolveCountryName(countryId);
  if (!resolvedName) return null;
  const src = `/country/${filenameByCountry[resolvedName]}`;
  return <Image src={src} alt={`${resolvedName} flag`} width={width} height={height} />;
}
