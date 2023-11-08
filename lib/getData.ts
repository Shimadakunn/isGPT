import { supabase } from "./supabase";
import { UserProfile } from "./types";

export const getUserProfile = async (id: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("credits")
    .select("*")
    .eq("id", id);
  if (error) {
    console.log("ERROR GETTING USER PROFILE");
    throw error;
  }
  return data[0];
};
