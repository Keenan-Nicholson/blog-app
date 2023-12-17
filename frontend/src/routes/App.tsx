import "../App.css";
import { NavBar } from "../components/NavBar";

const getPostData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3001/posts", {
      method: "GET",
    });
    const result = await response.json();

    console.log("Success:", result);

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const postData = await getPostData();

// TODO: get rid of the any type in the map function
export const App = () => {
  return (
    <div className="App">
      <NavBar />
      <div id="post-links">
        {Object.entries(postData.posts).map(([key, value]: any) => {
          return (
            <div key={key}>
              <a href={`/`}>
                {value.title} - {value.author}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
