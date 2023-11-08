import { getUserProfile } from "./getData";
import { supabase } from "./supabase";

export const createUserProfile = async (
    id: string,
) => {
    console.log("CREATING USER PROFILE FOR "+id);
  console.log({ test: await getUserProfile(id) });
  if ((await getUserProfile(id)) !== undefined) {
    console.log("USER PROFILE ALREADY EXISTS");
    return;
  }
    console.log("CREATING USER PROFILE");
  await supabase.from("credits").insert([
    {
        id: "yes",
    },
  ]);
};