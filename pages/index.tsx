import type {NextPage} from 'next'
import Link from 'next/link';

const Home: NextPage = () => {
    return (
        <div className="flex flex-col justify-center items-center flex-1">
            <div>
                <div className="pb-10">
                    <div className="font-medium font-mono">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-red-700 to-yellow-400">Firebase
                        </div>
                        <span className="text-sm"> Playground</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 aspect-square gap-4">
                    <Link href="/store">
                        <a
                            className="rounded-md border border-white/10 aspect-square p-5 text-center flex flex-col justify-center items-center bg-white/5">
                            <div className="">🔥</div>
                            <div className="font-semibold tracking-wide my-1">Firestore</div>
                            <div className="text-sm text-gray-500">Inspect your Firestore instance</div>
                        </a>
                    </Link>
                    <div
                        className="rounded-md border border-white/10 aspect-square p-5 text-center flex flex-col justify-center items-center bg-white/5">
                        <div className="">💿</div>
                        <div className="font-semibold tracking-wide my-1">Database</div>
                        <div className="text-sm text-gray-500">Coming soon 🚀</div>
                    </div>
                    <div
                        className="rounded-md border border-white/10 aspect-square p-5text-center flex flex-col justify-center items-center bg-white/5">
                        <div className="">🤖</div>
                        <div className="font-semibold tracking-wide my-1">Functions</div>
                        <div className="text-sm text-gray-500">Coming soon 🚀</div>
                    </div>
                    <div
                        className="rounded-md border border-white/10 aspect-square p-5text-center flex flex-col justify-center items-center bg-white/5">
                        <div className="">👮🏽</div>
                        <div className="font-semibold tracking-wide my-1">Auth</div>
                        <div className="text-sm text-gray-500">Coming soon 🚀</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
