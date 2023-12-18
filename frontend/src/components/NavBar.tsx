export const NavBar = () => {
  return (
    <div>
      <nav>
        <a href="/">
          <button>Home</button>
        </a>
        <a href="/login">
          {" "}
          <button>Login</button>
        </a>
        <a href="/create-post">
          <button id="create-post-button"> Create Post </button>
        </a>
      </nav>
    </div>
  );
};
