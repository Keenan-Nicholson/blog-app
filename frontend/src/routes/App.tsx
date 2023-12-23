import { useQuery } from "@tanstack/react-query";
import "../App.css";
import { Link } from "react-router-dom";

export const getPostData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3001/posts", {
      method: "GET",
    });
    const result = await response.json();

    console.log("Success:", result);

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

// TODO: get rid of the any type in the map function
export const App = () => {
  const { data: postData, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPostData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
