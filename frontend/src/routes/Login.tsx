import { useQueryClient, useMutation } from "@tanstack/react-query";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const postLogin = async (username: String, password: String) => {
  try {
    const response = await fetch(
      "https://personal-blog-app-backend.fly.dev/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ username, password }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      toast.success("Login successful");
      return { success: true, data: result };
    } else if (response.status === 401) {
      toast.error("Login unsuccessful");
      return { success: false, error: "Login unsuccessful" };
    } else {
      console.error("Error:", response.statusText);
      return { success: false, error: "An error occurred" };
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const Login = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const routeChange = () => {
    navigate("/");
  };
  const { mutate } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: String;
      password: String;
    }) => postLogin(username, password),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["authenticated"] });
      routeChange();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      username: formData.username,
      password: formData.password,
    });
  };

  return (
    <div>
      <form id="login-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" autoComplete="off" />
        </label>
        <label>
          Password:
          <input type="password" name="password" autoComplete="off" />
        </label>
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};
