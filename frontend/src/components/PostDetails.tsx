import { useParams } from "react-router-dom";
import { NavBar } from "./NavBar";
import { getPostData } from "../routes/App";

const postData = await getPostData();

// TODO I could probably make this into a useQuery hook instead of doing this. Not sure why but this feels wrong
export const PostDetails = () => {
  const { post_id } = useParams();

  const post = postData.posts.find(
    (post: any) => post.post_id.toString() === post_id
  );

  return (
    <div>
      <NavBar />
      <div id="post-details">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <br />
        <br />
        <i>By {post.author}</i>
        <br />
        <br />
        <i>Posted on {post.created_at.substring(0, 10)}</i>
        <br />
        <br />
        {post.edited_at && <i>updated on {post.edited_at}</i>}
      </div>
    </div>
  );
};

export default PostDetails;
