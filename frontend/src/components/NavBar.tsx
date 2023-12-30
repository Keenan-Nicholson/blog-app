import { useQuery, useQueryClient } from "@tanstack/react-query";

const logOut = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3001/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Logout successful");
    } else {
      console.error("Logout failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const NavBar = () => {
  const queryClient = useQueryClient();

  const checkAuthentication = useQuery({
    queryKey: ["authenticated"],
    queryFn: async () => {
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
    },
  });

  const handleLogout = async () => {
    await logOut();
    queryClient.invalidateQueries({ queryKey: ["authenticated"] });
  };

  return (
    <div>
      <nav>
        <a href="/">
          <button>Home</button>
        </a>
        <a href="/register">
          <button>Register</button>
        </a>
        {checkAuthentication.data?.success ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <a href="/login">
            <button>Login</button>
          </a>
        )}
        <a href="/create-post">
          <button id="create-post-button">Create Post</button>
        </a>
      </nav>
    </div>
  );
};
