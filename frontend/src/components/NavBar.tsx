export const NavBar = () => {
  return (
    <div>
      <nav>
        <a href="/">
          <button>Home</button>
        </a>
        <input type="text" id="search-bar" placeholder="Search" />

        <a href="/create-post">
          <button id="create-post-button"> Create Post </button>
        </a>
      </nav>
    </div>
  );
};
