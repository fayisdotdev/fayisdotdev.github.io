import { supabase } from "../lib/supabase";

export const fetchAllMessages = async () => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const toggleReadStatus = async (id, read) => {
  const { error } = await supabase
    .from("contacts")
    .update({ read: !read })
    .eq("id", id);

  if (error) throw error;
};

export const removeMessage = async (id) => {
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
