import type {NextPage} from 'next'
import {useForm} from 'react-hook-form';

function Tab() {
    const {register, getValues} = useForm<{ query: string }>();

    return (
        <form>
            <input {...register('query')} />
            {JSON.stringify(getValues())}
        </form>
    )
}

const Home: NextPage = () => {
    return (
        <div>
            <div>
                Tabs
            </div>

            <Tab/>
        </div>
    )
}

export default Home
