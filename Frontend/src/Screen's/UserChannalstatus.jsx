import axios from "axios";
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Link } from 'react-router-dom'
function Userchannalstatus() {
    const navigate = useNavigate();
    const { status, userdata } = useSelector((state) => state.auth)
    const [data, setdata] = useState({});
    const [error, seterror] = useState({
        status: false,
        msg: ""
    });
    const [loading, setloading] = useState(false);
    const [videodata, setvideodata] = useState([]);
    const [videoerror, setvideoerror] = useState({
        status: false,
        msg: ""
    });
    const [videoloading, setvideoloading] = useState(false);

    const getvideodata = async () => {
        setvideoerror({
            status: false,
            msg: ""
        });
        setvideoloading(true);
        setvideodata({});
        try {
            const response = await axios(`${import.meta.env.VITE_URL}/api/v1/users/getvideos/${userdata._id}`, { withCredentials: true });
            console.log(response.data.data)
            setvideodata(response.data.data.videos);
            console.log(videodata)
        } catch (error) {
            console.log(error.response);
            setvideoerror({
                status: true,
                msg: error.response.data.msg || "Error While Getting Data Pls Try Again"
            })

        } finally {
            setvideoloading(false);
        }
    }
    const getdata = async () => {
        seterror({
            status: false,
            msg: ""
        });
        setloading(true);
        setdata({});
        try {
            const response = await axios(`${import.meta.env.VITE_URL}/api/v1/users/dashboard/${userdata._id}`, { withCredentials: true });
            console.log(response.data.data)
            setdata(response.data.data);

        } catch (error) {
            console.log(error.response);
            seterror({
                status: true,
                msg: error.response.data.msg || "Error While Getting Data Pls Try Again"
            })

        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (userdata?._id && status) {
            getdata();
            getvideodata();
        } else {
            navigate("/")
        }
    }, [userdata, status])

    return (
        <>
            {loading && <div className="flex justify-center text-lg items-center">
                <div className='flex w-[100vw]  text-white dark:bg-black justify-center items-center'>
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
                        <h2 className="text-black dark:text-white mt-4">Loading...</h2>
                        <p className="text-black dark:text-zinc-400">
                            Your Adventure is About To Begin
                            <h3>Jai Shri Ram</h3>
                        </p>
                    </div>
                </div>
            </div>}
            {error.status && <div className="flex justify-center text-lg items-center">Error: {error.msg}</div>}
            {
                !loading && !error.status && data && videodata && (
                    <>
                        <div class="min-h-screen dark:bg-black text-black dark:text-white">
                            <div class="p-4">
                                <div class="mt-12">
                                    <div class="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                                        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                            <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
                                                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                                                    <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
                                                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                                                </svg>
                                            </div>
                                            <div class="p-4 text-right">
                                                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Totel View's</p>
                                                <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{data?.totalViews}</h4>
                                            </div>
                                            <div class="border-t border-blue-gray-50 p-4">
                                                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                                    With <strong class="text-green-500">{data.totalVideos}</strong>&nbsp;Video
                                                </p>
                                            </div>
                                        </div>
                                        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                            <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
                                                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div class="p-4 text-right">
                                                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Total Subscribers</p>
                                                <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{data?.totalSubscribers}</h4>
                                            </div>
                                            <div class="border-t border-blue-gray-50 p-4">
                                                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                                    Use <strong class="text-green-500">Tegs</strong>&nbsp; To Get More Subscribers
                                                </p>
                                            </div>
                                        </div>

                                        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                            <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
                                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                                                </svg>
                                            </div>
                                            <div class="p-4 text-right">
                                                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Total Video</p>
                                                <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{data.totalVideos}</h4>
                                            </div>
                                            <div class="border-t border-blue-gray-50 p-4">
                                                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                                    Upload More
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
                                        <div class="relative sm:w-max flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                                            <div class="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                                                <div>
                                                    <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">Videos</h6>
                                                    <p class="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" aria-hidden="true" class="h-4 w-4 text-blue-500">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                        </svg>
                                                        <strong>{data?.totalVideos} Upload's</strong> Till Now
                                                    </p>
                                                </div>

                                            </div>
                                            <div class="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                                                <table class="w-full min-w-[640px] table-auto">
                                                    <thead>
                                                        <tr>
                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Title</p>
                                                            </th>
                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">View's</p>
                                                            </th>

                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Tegs</p>
                                                            </th>
                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Is Published ?</p>
                                                            </th>
                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Edit</p>
                                                            </th>
                                                            <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                                                                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400"></p>
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            videodata.length >= 0 && (
                                                                videodata.map((video) => (
                                                                    <tr key={video.owner}>
                                                                        <td class="py-3 px-5 border-b border-blue-gray-50">
                                                                            <div class="flex items-center gap-4">
                                                                                <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{video?.tittle}</p>
                                                                            </div>
                                                                        </td>
                                                                        <td class="py-3 px-5 border-b border-blue-gray-50">
                                                                            <p class="block antialiased font-sans text-xs font-medium text-blue-gray-600">{video?.views}</p>
                                                                        </td>
                                                                        <td class="py-3 px-5 border-b border-blue-gray-50">
                                                                            <p class="block antialiased font-sans text-xs font-medium text-blue-gray-600">{video.tegs}</p>
                                                                        </td>
                                                                        <td class="py-3 px-5 border-b border-blue-gray-50">
                                                                            <p class="block antialiased font-sans text-xs font-medium text-blue-gray-600">{video?.isPublished ? 'True' : "False"}</p>
                                                                        </td>
                                                                        <td class="py-3 px-5 border-b border-blue-gray-50">
                                                                            <Link to={`/editvideo/${video._id}`}>
                                                                                Edit
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-blue-gray-600">
                                    <footer className="py-2">
                                        <div className="flex w-full flex-wrap items-center justify-center gap-6 pl-4 bottom-1 md:justify-between">
                                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-inherit"><span className='text-blue-500'>VIBESOCIAL</span> © 2024 Made With <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" aria-hidden="true" className="-mt-0.5 inline-block h-3.5 w-3.5">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
                                            </svg> by <a href="https://url-shortner-mern-uetd.onrender.com/Js0GzP6A" target="_blank" className="transition-colors hover:text-blue-500">BPSS </a></p>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}
export default Userchannalstatus