"use server";
import { revalidateTag } from "next/cache";

export async function revalidateIntents() {
  revalidateTag("intents");
}
