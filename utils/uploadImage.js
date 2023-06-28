import { supabase } from "../lib/supabaseClient";

export const uploadImage = async (file) => {
  const fullFileName = file.name.split(".");
  const fileName = fullFileName[0];
  const fileExt = fullFileName[1];

  const filePath = `${fileName}-${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("blog_post_images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error };
  }

  const {
    data: { publicUrl },
    error: publicUrlError,
  } = await supabase.storage.from("blog_post_images").getPublicUrl(data.path);

  if (publicUrlError) {
    return { publicUrlError };
  }

  return {
    error: false,
    publicUrl,
  };
};
