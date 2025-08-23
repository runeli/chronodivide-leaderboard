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
  countryName: CountryName;
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

export default function PlayerCountry({ countryName }: PlayerCountryProps) {
  const country = getRandomCountry();
  const src = `/country/${filenameByCountry[country]}`;
  return <Image src={src} alt={`${country} flag`} width={47} height={23} />;
}

export function getRandomCountry(): CountryName {
  const countries = Object.keys(filenameByCountry) as CountryName[];
  const index = Math.floor(Math.random() * countries.length);
  return countries[index];
}
