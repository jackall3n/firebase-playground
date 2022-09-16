import type {NextPage} from 'next'
import {useForm} from 'react-hook-form';
import {FirebaseApp, initializeApp, getApps, getApp} from 'firebase/app';
import {collection, doc, Firestore, getFirestore, onSnapshot} from 'firebase/firestore';
import {useEffect, useMemo, useState} from "react";
import {flatten, orderBy, uniq} from 'lodash';
import {useRouter} from "next/router";
import Link from 'next/link';


function useApp(projectId: string) {
    const app = useMemo(() => {
        if (!projectId) {
            return null;
        }

        const apps = getApps();
        const app = apps.find(a => a.name === projectId);

        if (app) {
            return app
        }

        try {


            return initializeApp({
                projectId
            }, projectId)
        } catch (e) {
            console.error('failed to get app for id', projectId, e)
        }
    }, [projectId])

    return app;
}

function useStore(app?: FirebaseApp | null) {
    console.log({app})

    const store = useMemo(() => {
        if (!app) {
            return null
        }

        return getFirestore(app);

    }, [app])

    return store;
}

function Tab() {
    const {push, query} = useRouter();
    const projectId = query.projectId as string;
    const segments = (query.path as string)?.split('/').map(s => s.trim()).filter(Boolean) ?? [];
    const path = segments.join('/')

    const {register, handleSubmit, setValue} = useForm<{ path: string, projectId: string }>({
        defaultValues: query,
    });

    useEffect(() => {
        setValue('projectId', projectId)
        setValue('path', path)
    }, [projectId, path])

    const app = useApp(projectId);
    const store = useStore(app);

    function onSubmit(values: { path: string, projectId: string }) {
        push({
            query: {
                path: values.path,
                projectId: values.projectId
            }
        })
    }

    console.log({store, path})

    const isCollection = segments.length % 2 !== 0;

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-5">
                <form onSubmit={handleSubmit(onSubmit)} className="flex">
                    <div
                        className="flex-1 flex flex-row bg-white/10 border-white/20 border rounded-md divide-x divide-white/20 overflow-hidden">
                        <input {...register('projectId')} placeholder="Project Id"
                               className="bg-transparent font-mono text-sm px-4 h-10 outline-none autofill:!bg-red-500 appearance-none"/>
                        <input {...register('path')}
                               className="bg-transparent font-mono text-sm px-4 h-10 outline-none flex-1 autofill:bg-white/20"/>

                    </div>
                    <button className="bg-sky-600 rounded-md w-32 font-normal text-sm ml-2">Send</button>
                    <input type="submit" hidden={true}/>
                </form>
            </div>

            <div className="overflow-auto flex flex-1 pb-5 px-5">
                {isCollection ? <Collection path={path} store={store} projectId={projectId}/> :
                    <Document path={path} store={store} projectId={projectId}/>}
            </div>
        </div>
    )
}

function Collection({path, store, projectId}: { path: string, projectId: string, store: Firestore | null }) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!store) {
            return;
        }

        if (!path) {
            return;
        }

        return onSnapshot(collection(store, path), (snapshot) => {
            console.log(snapshot)

            setData(snapshot.docs);
        })

    }, [path, store]);

    const headers = useMemo(() => {
        const values = flatten(data.map(a => Object.keys(a.data())));

        const headers = uniq(values);
        console.log(headers);

        return orderBy(headers);

    }, [data])

    console.log({data, headers});

    return (
        <div className="flex flex-1 flex-col">
            <div className="text-xs">
                {data.length} Results
            </div>

            <div className="overflow-x-auto">
                <table className="flex-1">
                    <thead>
                    <tr className="text-sm">
                        <td className="px-2 py-1">id</td>

                        {headers.map(header => (
                            <td key={header} className="px-2 py-1">
                                {header}
                            </td>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {data.map(document => {
                        const data = document.data();


                        return (
                            <tr key={document.id} className="font-mono font-light text-xs">
                                <td className="pb-1 pr-1">
                                    <ContentLink projectId={projectId}
                                                 path={`${document.ref.parent.path}/${document.id}`}
                                                 value={document.id}/>
                                </td>

                                {headers.map(header => {
                                    const value = data[header];

                                    return (
                                        <td key={header} className="max-w-xl pb-1 pr-1">
                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                <Content value={value} projectId={projectId}/>
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

function Document({path, store, projectId}: { path: string, projectId: string, store: Firestore | null }) {
    const [data, setData] = useState<any>();

    useEffect(() => {
        if (!store) {
            return;
        }

        if (!path) {
            return;
        }

        return onSnapshot(doc(store, path), (snapshot) => {
            console.log(snapshot)

            setData(snapshot?.data());
        })

    }, [path, store]);

    return (
        <div className="flex flex-1 flex-col overflow-auto">
            <div className="overflow-auto font-mono text-sm">
                <pre>
                    <code>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            </div>
        </div>
    )
}

function Content({value, projectId}: { value: any, projectId: string }) {
    const isArray = Array.isArray(value);
    const isObject = typeof value === 'object';

    if (isArray) {
        return (
            <div className="bg-white/5 rounded-md px-2 py-1">{String(value.length)} items</div>
        )
    }

    if (isObject) {
        if ('toDate' in value) {
            return (
                <div className="bg-white/5 rounded-md px-2 py-1">
                    {value.toDate().toLocaleDateString()} {value.toDate().toLocaleTimeString()}
                </div>
            )
        }

        if (value?.firestore?.type === 'firestore') {
            return (
                <ContentLink projectId={projectId} path={value?.path} value={value?.path}/>
            )
        }

        return (
            <div
                className="max-w-sm bg-white/5 font-mono rounded-md px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">{
                JSON.stringify(value)
            }</div>
        )
    }

    if (typeof value === 'string' && value.startsWith('http')) {
        return (
            <a href={value} target="_blank"
               className="max-w-sm underline px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">{
                value
            }</a>
        )
    }

    if (typeof value === 'string') {
        return (
            <div
                className="max-w-sm px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">{
                value
            }</div>
        )
    }

    if (typeof value === 'number') {
        return (
            <div
                className="max-w-sm px-2 py-1 text-right text-ellipsis overflow-hidden whitespace-nowrap">{String(value)}</div>
        )
    }
    if (typeof value === 'boolean') {
        return (
            <div className="flex justify-end">
                <div className="bg-white/5 font-mono rounded-md px-2 py-1">
                    {String(value)}
                </div>
            </div>
        )
    }

    if (value === null) {
        return (
            <div
                className=" max-w-sm px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">
                null
            </div>
        )
    }

    if (value === undefined) {
        return (
            <div className=" px-2 py-1 text-white/
                20">
                -
            </div>
        )
    }

    console.log({value})

    return (
        <div className="">
            ?
        </div>
    )
}

function ContentLink({projectId, path, value}: { projectId: string, path?: string, value?: string }) {
    return (
        <Link href={{
            href: '/store',
            query: {
                projectId,
                path
            }
        }}>
            <a target="_blank"
               className="block max-w-sm underline bg-white/5 rounded-md px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">{
                value
            }</a>

        </Link>
    )
}

const Home: NextPage = () => {
    return (
        <div className="flex flex-1 overflow-hidden">
            <Tab/>
        </div>
    )
}

export default Home
