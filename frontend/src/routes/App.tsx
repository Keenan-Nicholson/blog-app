import { useQuery } from "@tanstack/react-query";
import "../App.css";
import { Link } from "react-router-dom";

export const getPostData = async () => {
  try {
    const response = await fetch(
      "https://personal-blog-app-backend.fly.dev/posts",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to signal a failed query
  }
};

export const App = () => {
  const {
    data: postData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPostData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !postData || !postData.posts) {
    return <div>Error fetching posts</div>;
  }

  return (
    <div className="App">
      <div id="post-links">
        {Object.entries(postData.posts).map(([key, value]: any) => {
          return (
            <div key={key}>
              <Link to={`/posts/${value.post_id}`}>
                {value.title} - {value.author}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
