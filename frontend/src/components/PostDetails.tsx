import { useParams } from "react-router-dom";
import { NavBar } from "./NavBar";
import { getPostData } from "../routes/App";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const PostDetails = () => {
  const cachedData = localStorage.getItem("cachedPosts");
  const initialData = cachedData ? JSON.parse(cachedData) : null;

  const {
    data: postData,
    isLoading,
    isError,
  } = useQuery({
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
    return <span className="loader"></span>;
  }

  if (isError) {
    return console.error("Error fetching data");
  }

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
      </div>
    </div>
  );
};
