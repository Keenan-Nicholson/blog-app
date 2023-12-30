import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const queryClient = useQueryClient();

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

  const createAccount = async (username: String, password: String) => {
    try {
      const response = await fetch("http://127.0.0.1:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful");
        return { success: true, data: result };
      } else if (response.status === 401) {
        toast.error("Registration unsuccessful");
        return { success: false, error: "Register unsuccessful" };
      } else {
        console.error("Error:", response.statusText);
        return { success: false, error: "An error occurred" };
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    }) => createAccount(username, password),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ["authenticated"] });
      routeChange();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authenticated.user.username !== "keeborg") {
      toast.error("You can only create an account if you are an admin");
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
