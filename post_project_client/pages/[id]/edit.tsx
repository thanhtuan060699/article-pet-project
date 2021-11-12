import axios from "axios";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useFormik } from "formik";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "react-select";
import "tailwindcss/tailwind.css";
import * as Yup from "yup";
import { CATEGORIES } from "../../utils/constant";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const Home: NextPage = () => {
  const router = useRouter();

  const [post, setPost] = useState<any>(CATEGORIES[0]);
  const [category, setCategory] = useState<any>();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { id } = router.query;
  useEffect(() => {
    if (id) {
      axios.get(`/api/post/${id}`).then((response) => {
        let postRes = response.data.post;
        let categogyObj = CATEGORIES.filter((i) => {
          return i.value == postRes.category;
        });
        setCategory(postRes.category);
        postRes.category = categogyObj[0];
        setPost(postRes);
        const editorStateWithoutUndo = EditorState.createWithContent(
          convertFromRaw(JSON.parse(postRes.content))
        );
        setEditorState(editorStateWithoutUndo);
      });
    }
  }, [id]);

  const createPostSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
  });

  const { setFieldValue, values, errors, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        title: post.title,
        active: post.active,
        category: post.category,
        content: "",
      },
      enableReinitialize: true,
      validationSchema: createPostSchema,
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: async (values: any) => {
        const params = {
          ...values,
          category: values.category.value,
          content: JSON.stringify(values.content),
        };
        try {
          const res = await axios.put(`/api/post/${id}`, params);
          if (res) {
            router.push(`/${id}`);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-between items-center">
      <div className="container mx-auto my-10 shadow-xl border-solid border bg-white border-gray-400 rounded-xl w-1/2 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-medium">Title</label>
            <input
              className="border-solid border border-gray-300 rounded w-full h-10 px-2 py-1"
              onChange={handleChange}
              value={values.title}
              name="title"
              type="text"
            />
            {errors.title ? (
              <div className="text-red-600 text-sm">{errors.title}</div>
            ) : null}
          </div>
          <div className="flex items-center">
            <div className="w-1/2 space-y-1">
              <label className="font-medium">Category</label>
              <Select
                options={CATEGORIES}
                name="category"
                onChange={handleChange}
                value={values.category}
              />
              {errors.category ? (
                <div className="text-red-600 text-sm">{errors.category}</div>
              ) : null}
            </div>
            <label className="w-1/2 mt-6 ml-6">
              <input
                onChange={handleChange}
                name="active"
                type="checkbox"
                checked={values.active}
                className="form-checkbox"
              />
              <span className="ml-2 font-medium">Active</span>
            </label>
          </div>
          <div className="space-y-1">
            <label className="font-medium">Content</label>
            <Editor
              editorState={editorState}
              onEditorStateChange={(value: any) => {
                setFieldValue(
                  "content",
                  convertToRaw(value.getCurrentContent())
                );
                setEditorState(value);
              }}
              toolbarClassName="toolbar-class rounded border-gray-300"
              wrapperClassName="wrapper-class"
              editorClassName="editor-class border rounded border-gray-300 h-40 px-2 py-1"
              name="content"
            />
            {errors.content ? (
              <div className="text-red-600 text-sm">{errors.content}</div>
            ) : null}
          </div>
          <div className="text-center space-x-4">
            <button
              onClick={() => router.push("/")}
              type="button"
              className="px-6 py-2 border-solid bg-gray-400 text-white rounded"
            >
              Create Post
            </button>
            <button
              type="submit"
              className="px-6 py-2 border-solid bg-blue-500 text-white rounded"
            >
              Edit Post
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${id}`)}
              className="px-6 py-2 border-solid bg-gray-400 text-white rounded"
            >
              Back detail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
