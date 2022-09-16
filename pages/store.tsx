import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Query } from "../components/store/Query";
import { Tabs } from "../components/store/Tabs";
import { BoltIcon } from "@heroicons/react/24/outline";

function Tab() {
  const { push, query } = useRouter();

  const projectId = query.projectId as string;
  const path = query.path as string;

  async function onSubmit(values: { path: string; projectId: string }) {
    await push({
      query: {
        path: values.path,
        projectId: values.projectId,
      },
    });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-5">
        <Formik
          onSubmit={onSubmit}
          enableReinitialize
          initialValues={{
            path: query.path as string ?? '',
            projectId: query.projectId as string ?? '',
          }}
        >
          <Form className="grid gap-2">
            <div className="flex">
              <div className="flex-1 flex flex-row bg-white/5 border-white/20 border rounded-md divide-x divide-white/20 overflow-hidden">
                <Field
                  name="projectId"
                  placeholder="Enter a Project Id"
                  className="placeholder:text-xs bg-transparent flex-1 sm:flex-grow-0 font-mono text-sm px-4 h-10 outline-none autofill:!bg-red-500 appearance-none"
                />

                <Field
                  name="path"
                  placeholder="Enter a collection/document path"
                  className="placeholder:text-xs bg-transparent hidden sm:block font-mono text-sm px-4 h-10 outline-none flex-1 autofill:bg-white/20"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 rounded-md flex justify-center items-center px-3 sm:w-32 font-normal text-sm ml-2"
              >
                <div className="hidden sm:block">Send</div>
                <div className="sm:hidden block">
                  <BoltIcon className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="flex-1 flex flex-row bg-white/5 border-white/20 border rounded-md divide-x divide-white/20 overflow-hidden  sm:hidden block">
              <Field
                name="path"
                placeholder="Enter a collection/document path"
                className="placeholder:text-xs bg-transparent font-mono text-sm px-4 h-10 outline-none flex-1 autofill:bg-white/20"
              />
            </div>
          </Form>
        </Formik>
      </div>

      <div className="overflow-auto flex flex-1 pb-5 px-5">
        <Query path={path} projectId={projectId} />
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Tabs />
      <Tab />
    </div>
  );
};

export default Home;
