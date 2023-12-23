import { useParams } from "react-router-dom";
import { NavBar } from "./NavBar";
import { getPostData } from "../routes/App";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const PostDetails = () => {
  const cachedData = localStorage.getItem("cachedPosts");
  const initialData = cachedData ? JSON.parse(cachedData) : null;

  const { data: postData, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPostData,
    initialData,
  });

  useEffect(() => {
    if (postData) {
      localStorage.setItem("cachedPosts", JSON.stringify(postData));
    }
  }, [postData]);

  const { post_id } = useParams();

  const post = postData.posts.find(
    (post: any) => post.post_id.toString() === post_id
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: post.post_id }),
      });
      console.log(JSON.stringify({ post_id: post.post_id }));
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }
      if (response.status === 204) {
        console.log("Success: Post deleted successfully");
      } else {
        const result = await response.json();
        console.log("Success:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div id="post-details">
        <h3 id="post-title">{post.title}</h3>
        <p>{post.content}</p>
        <br />
        <br />
        <i>By {post.author}</i>
        <br />
        <br />
        <i>Posted on {post.created_at.substring(0, 10)}</i>
        <br />
        <br />
        {post.edited_at && <i>updated on {post.edited_at.substring(0, 10)}</i>}

        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};
