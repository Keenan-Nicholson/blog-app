import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { getPostData } from "../routes/App";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../App.css";
import { toast } from "react-toastify";

export const PostDetails = () => {
  const cachedData = localStorage.getItem("cachedPosts");
  const initialData = cachedData ? JSON.parse(cachedData) : null;
  const queryClient = useQueryClient();

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

  const checkAuthentication = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/whoami", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      console.log("Success:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const { data: authenticated } = useQuery({
    queryKey: ["authenticated"],
    queryFn: checkAuthentication,
  });

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

  const editPost = async (title: String, content: String) => {
    try {
      const response = await fetch("http://127.0.0.1:3001/edit-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: post.post_id, title, content }),
      });
      console.log(JSON.stringify({ post_id: post.post_id, title, content }));
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }
      if (response.status === 204) {
        console.log("Success: Post edited successfully");
      } else {
        const result = await response.json();
        console.log("Success:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };

  const { mutate } = useMutation({
    mutationFn: ({ title, content }: { title: String; content: String }) =>
      editPost(title, content),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSaveClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authenticated.success) {
      toast.error("You must be logged in to edit a post");
      return;
    }
    const { target } = event;
    const inputs = [...(target as unknown as HTMLInputElement[])];
    const formData = Object.fromEntries(
      inputs
        .filter((el) => el.name.length)
        .filter((el) => !el.name.includes("remember"))
        .map((el) => [el.name, el.value])
    );

    mutate({
      title: formData.title,
      content: formData.content,
    });

    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    handleDelete();
    routeChange();
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  return (
    <div>
      <NavBar />
      <div id="post-details">
        {isEditing ? (
          <form onSubmit={handleSaveClick}>
            <input
              id="post-title"
              type="text"
              value={editedTitle}
              autoComplete="off"
              name="title"
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <br />
            <textarea
              id="post-content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              name="content"
            />
            <br />
            <div>
              <button type="submit">Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
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
            {post.edited_at && (
              <i>updated on {post.edited_at.substring(0, 10)}</i>
            )}
            <br />
            <div>
              <button onClick={handleEditClick}>Edit</button>
              <button onClick={handleDeleteClick}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
