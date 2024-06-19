"use client";

import Image from "next/image";
import React from "react";

import { PlaceholdersAndVanishInput } from "@/components/atoms/query-input";

const QueryIntents = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex flex-col justify-between items-center gap-10 min-h-60">
      <h2 className="text-xl text-center sm:text-3xl text-black">
        Query them Swaps! On your terms.
      </h2>
      <Image
        alt="query intents"
        src="https://illustrations.popsy.co/pink/business-success-chart.svg"
        width={400}
        height={400}
      />
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default QueryIntents;
