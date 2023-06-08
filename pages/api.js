import { supabase } from "@/lib/supabaseClient";

export async function getBlogData() {
	try {
	  const { data, error } = await supabase
		.from('blog-data')
		.select();
  
	  if (error) {
		return { error: 'Something has gone wrong.' };
	  }
  
	  return { data };
	} catch (error) {
	  console.log(error);
	}
  };

export async function getBlogPost({ slug }) {
	try {
	  const { data, error, status } = await supabase
		.from("blog-data")
		.select("*")
		.eq("slug", slug)
		.single();
  
		console.log(slug);

	  if (error) {
		return { error: 'Something has gone wrong.' };
	  }
  
	  return { data, status, error };
	} catch (error) {
	  console.log(error);
	}
  };