import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Query } from "../components/store/Query";
import { Tabs } from "../components/store/Tabs";

function Tab() {
  const { push, query } = useRouter();

  const projectId = query.projectId as string;
  const path = query.path as string;

  const { register, handleSubmit, setValue } = useForm<{
    path: string;
    projectId: string;
  }>({
    defaultValues: query,
  });

  useEffect(() => {
    setValue("projectId", projectId);
    setValue("path", path);
  }, [projectId, path]);

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex">
          <div className="flex-1 flex flex-row bg-white/10 border-white/20 border rounded-md divide-x divide-white/20 overflow-hidden">
            <input
              {...register("projectId")}
              placeholder="Enter a Project Id"
              className="placeholder:text-xs bg-transparent font-mono text-sm px-4 h-10 outline-none autofill:!bg-red-500 appearance-none"
            />
            <input
              {...register("path")}
              placeholder="Enter a collection/document path"
              className="placeholder:text-xs bg-transparent font-mono text-sm px-4 h-10 outline-none flex-1 autofill:bg-white/20"
            />
          </div>
          <button className="bg-sky-600 rounded-md w-32 font-normal text-sm ml-2">
            Send
          </button>
          <input type="submit" hidden={true} />
        </form>
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
