import "../App.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const createPost = async (title: String, content: String, author: String) => {
  try {
    const response = await fetch(
      "https://personal-blog-app-backend.fly.dev/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author }),
      }
    );

    const result = await response.json();
    console.log("Success:", result);

    toast.success("Post created successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

const checkAuthentication = async () => {
  try {
    const response = await fetch(
      "https://personal-blog-app-backend.fly.dev/whoami",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const CreatePost = () => {
  const queryClient = useQueryClient();
  const { data: authenticated } = useQuery({
    queryKey: ["authenticated"],
    queryFn: checkAuthentication,
  });

  const navigate = useNavigate();
  const routeChange = () => {
    navigate("/");
  };

  const { mutate } = useMutation({
    mutationFn: ({
      title,
      content,
      author,
    }: {
      title: String;
      content: String;
      author: String;
    }) => createPost(title, content, author),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      routeChange();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authenticated.success) {
      toast.error("You must be logged in to create a post");
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
      author: authenticated.user.username,
    });
  };

  return (
    <div>
      <div className="create-post">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" autoComplete="off" />
          <label htmlFor="post-content">Content</label>
          <textarea id="post-content" name="content" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
