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