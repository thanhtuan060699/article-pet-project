import axios from "axios";
import draftToHtml from "draftjs-to-html";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "tailwindcss/tailwind.css";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<any>({});
  const getPost = async (id: any) => {
    const res = await axios.get(`/api/post/${id}`);
    if (res && res.data) return res.data.post;
    else return { title: "Not Found" };
  };
  const initData = async () => {
    const data = await getPost(id);
    setPost(data);
  };
  useEffect(() => {
    id && initData();
  }, [id]);

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-between items-center">
      <div className="container mx-auto my-10 shadow-xl border-solid border bg-white border-gray-400 rounded-xl w-1/2 p-8 space-y-4">
        <h1 className="text-xl font-bold">{post.title}</h1>
        <p className="text-blue-400">{post.category}</p>
        <p className="text-green-400">{post.active ? "Published" : "Draft"}</p>
        <hr />
        <div
          dangerouslySetInnerHTML={{
            __html: post.content
              ? draftToHtml(JSON.parse(post.content || "{}"))
              : "<p></p>",
          }}
        ></div>
        <div className="text-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 border-solid bg-blue-500 text-white rounded"
          >
            Create Post
          </button>
          <button
            onClick={() => router.push(`/${id}/edit`)}
            className="px-6 py-2 border-solid bg-green-500 text-white rounded"
          >
            Edit Post
          </button>
          <button
            onClick={() => router.push(`/chart`)}
            className="px-6 py-2 border-solid bg-red-400 text-white rounded"
          >
            View chart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
