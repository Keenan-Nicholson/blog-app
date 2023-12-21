import "../App.css";
import { NavBar } from "../components/NavBar";
import { useMutation, useQuery } from "@tanstack/react-query";

const createPost = async (title: String, content: String, author: String) => {
  try {
    const isAuthenticated = await checkAuthentication();

    if (!isAuthenticated.success) {
      console.error("User not authenticated");
      return;
    }
    const response = await fetch("http://127.0.0.1:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, author }),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};

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

export const CreatePost = () => {
  const { data: authenticated } = useQuery({
    queryKey: ["authenticated"],
    queryFn: checkAuthentication,
  });

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
    },
  });

  // TODO: figure out why toast.error doesnt work here

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!authenticated.success) {
      alert("You must be logged in to create a post");
      return;
    }

    event.preventDefault();
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
      <NavBar />
      <div className="create-post">
        <h3>Create a new post</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          <label htmlFor="post-content">Content</label>
          <textarea id="post-content" name="content" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
