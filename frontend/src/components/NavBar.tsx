import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SetStateAction, useState } from "react";

const logOut = async () => {
  try {
    const response = await fetch(
      "https://personal-blog-app-backend.fly.dev/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

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
    },
  });

  const handleLogout = async () => {
    await logOut();
    queryClient.invalidateQueries({ queryKey: ["authenticated"] });
  };

  const [accountName, setAccountName] = useState("");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setAccountName(event.target.value);
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await fetch(
        "https://personal-blog-app-backend.fly.dev/delete-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: accountName }),
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log("Account deleted successfully");
      } else {
        console.error("Account deletion failed:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowDeleteAccountModal(false);
    }
  };

  const closeModal = () => {
    setShowDeleteAccountModal(false);
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
          <>
            <button onClick={handleLogout}>Logout</button>
            <div>
              {!showDeleteAccountModal ? (
                <button onClick={handleDeleteAccount}>Delete Account</button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter account name"
                    value={accountName}
                    onChange={handleInputChange}
                  />
                  <button onClick={confirmDeleteAccount}>Confirm Delete</button>
                  <button onClick={closeModal}>Cancel</button>
                </>
              )}
            </div>
            <a href="/create-post">
              <button id="create-post-button">Create Post</button>
            </a>
          </>
        ) : (
          <a href="/login">
            <button>Login</button>
          </a>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
