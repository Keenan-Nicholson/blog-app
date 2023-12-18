import { NavBar } from "../components/NavBar";
import "../App.css";
import { useMutation } from "@tanstack/react-query";

const postLogin = async (username: String, password: String) => {
  try {
    const response = await fetch("http://127.0.0.1:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const Login = () => {
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
      <NavBar />
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="text" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
