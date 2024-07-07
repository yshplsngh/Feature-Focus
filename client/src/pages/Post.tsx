import {useEffect } from "react";
import {InfiniteQueryObserverResult, useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {bashApi} from "../api/bashApi.tsx";
import Loading from "../component/Loading.tsx";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {PostType, ResultType} from "../types/Post.ts";


const Post = () => {

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData<{pageParams:number[],pages:ResultType[]}>(['posts'])

    // console.log(cachedData)

    /* pageParam is actually a skipped number but it must be named with pageParam */
    const fetchDummyPosts = async ({ pageParam = 0 }):Promise<ResultType> => {
        const res = await bashApi.get(`/post?limit=${10}&skip=${pageParam}`)
        return res.data;

    };

    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        isFetchingNextPage
    }:InfiniteQueryObserverResult<{pageParams:number[],pages:ResultType[]},AxiosError<AxiosOMessageResponse>> = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchDummyPosts,
        initialPageParam: 0,
        initialData: cachedData,
        refetchOnWindowFocus:false,
        retry:false,
        getNextPageParam: (lastPage: ResultType) => {
            const { skip, limit, total } = lastPage;
            const nextPage = skip + limit;
            return nextPage < total ? nextPage : undefined;
        }
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        (async ()=>{
            if (inView) {
                await fetchNextPage();
            }
        })()
    }, [inView, fetchNextPage]);

    // console.log(data);

    if (isLoading) return <Loading/>
    if (isError) {
        console.log(error?.response)
        toast.error(error?.response?.data?.message || error.message);
    }

    // console.log(data)
    // console.log(cachedData)
    return (
        <section className={'scroll-smooth'}>
            {data?.pages.map((page: ResultType, pageIndex: number) => (
                <div key={pageIndex}>
                    {page.posts.map((post: PostType) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            ))}
            <div className={'text-red-500'}>{isError && `${error?.response?.data?.message}`}</div>
            <div ref={ref} className={'op pb-28'}>{isFetchingNextPage && <Loading/>}</div>
        </section>
    );
};

export default Post;
