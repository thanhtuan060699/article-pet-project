import axios from "axios";
import { convertToRaw, EditorState } from "draft-js";
import { useFormik } from "formik";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "react-select";
import "tailwindcss/tailwind.css";
import * as Yup from "yup";
import { CATEGORIES } from "../utils/constant";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const Home: NextPage = () => {
  const router = useRouter();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const createPostSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
  });

  const { setFieldValue, values, errors, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        title: "",
        active: true,
        category: CATEGORIES[0],
        content: "",
      },
      validationSchema: createPostSchema,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async (values: any) => {
        const params = {
          ...values,
          category: values.category.value,
          content: JSON.stringify(values.content),
        };
        try {
          const res = await axios.post("/api/post", params);
          if (res && res.data) {
            router.push(`/${res.data._id}`);
          }
        } catch (error) {}
      },
    });

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-between items-center">
      <div className="container mx-auto my-10 shadow-xl border-solid border bg-white border-gray-400 rounded-xl w-1/2 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-medium">Title</label>
            <input
              className="border-solid border border-gray-300 rounded w-full h-10 p-2"
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
                onChange={(cate)=>setFieldValue("category",cate)}
                value={values.category}
                className="z-10"
              />
              {errors.category && (
                <div className="text-red-600 text-sm">{errors.category}</div>
              )}
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
              editorClassName="editor-class border rounded border-gray-300 h-40 p-2"
              name="content"
              value={editorState}
            />
            {errors.content ? (
              <div className="text-red-600 text-sm">{errors.content}</div>
            ) : null}
          </div>
          <div className="text-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 border-solid bg-blue-500 text-white rounded"
            >
              Create Post
            </button>
            <button
              onClick={() => router.push(`/chart`)}
              className="px-6 py-2 border-solid bg-red-400 text-white rounded"
            >
              View chart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
