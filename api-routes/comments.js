import { supabase } from "@/lib/supabaseClient";

// export async function getBlogData() {
// 	try {
// 	  const { data, error } = await supabase
// 		.from('blog-data')
// 		.select();
  
// 	  if (error) {
// 		return { error: 'Something has gone wrong.' };
// 	  }
  
// 	  return { data };
// 	} catch (error) {
// 	  console.log(error);
// 	}
//   };

export const getComments = async () => {
  try {
	  const { data, error } = await supabase
		.from('comments')
		.select();
  
	  if (error) {
		return { error: 'Something has gone wrong.' };
	  }
  
	  return { data };
	} catch (error) {
	  console.log(error);
	}


};

export const addComment = () => {
  //Handle add comment here
};

export const removeComment = () => {
  //Handle remove comment here
};
