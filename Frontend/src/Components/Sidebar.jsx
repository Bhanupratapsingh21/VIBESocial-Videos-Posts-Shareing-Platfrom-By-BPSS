import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthLogout } from '../Store/features/Slice';
import axios from 'axios';
import { useToast } from "@chakra-ui/react";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const { status, userdata } = useSelector((state) => state.auth);
    const handlelogout = async () => {

        try {
            const logout = await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/logout`, {}, {
                withCredentials: true
            })
            if (logout.data.success === true) {
                localStorage.removeItem("refreshToken")
                dispatch(AuthLogout())

                toast({
                    title: "Logged out successfully.",
                    description: "You have been logged out.",
                    status: "success",
                    duration: 5000,
                    position: "top",
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error While Logout Pls Try Again.",
                    description: "An Error Occured While Logout User.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <aside className="fixed hidden sm:block left-0 top-0 h-screen w-[20vw] bg-white dark:bg-black rounded-r-3xl dark:text-white  z-10">
            <div className="min-h-screen flex bg-gray-100 dark:bg-black">
                <div className="hidden min-w-40 sm:flex flex-col  w-[20vw] bg-white dark:bg-black overflow-hidden">
                    <Link to={"/"} className="flex items-center mt-1 pl-4 justify-center h-20">
                        <h1 className="text-3xl uppercase text-indigo-500">&lt;VibeSocial/&gt;</h1>
                    </Link>
                    <ul className="mt-4">

                        <li>
                            <Link to={"/"} href="#" className="flex flex-row hover:border border-gray-600 rounded-3xl justify-left px-4 items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                <span className="inline-flex items-center justify-center h-12  text-lg dark:text-white"><i className="bx bx-home"></i></span>
                                <span className="text-sm font-medium">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/upload"} href="#" className="flex flex-row hover:border border-gray-600 rounded-3xl  px-4 items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-bell"></i></span>
                                <span className="text-sm font-medium">Upload</span>

                            </Link  >
                        </li>
                        <li>
                            <Link to={"/videos"} href="#" className="flex flex-row hover:border border-gray-600 rounded-3xl  px-4 items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-music"></i></span>
                                <span className="text-sm font-medium">Video's</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/tweets"} href="#" className="flex flex-row hover:border border-gray-600 rounded-3xl  px-4 items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-drink"></i></span>
                                <span className="text-sm font-medium">Tweet's</span>
                            </Link>
                        </li>

                        <li>
                            <Link to={"/playlist"} href="#" className="flex flex-row hover:border border-gray-600 rounded-3xl  px-4 items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-chat"></i></span>
                                <span className="text-sm font-medium">Playlist's</span>
                            </Link>
                        </li>
                        {
                            status ? (
                                <>
                                    <li>
                                        <Link to={"/subscription"} href="#" className="flex flex-row hover:border  px-4 border-gray-600 rounded-3xl items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                            <span className="inline-flex items-center justify-center h-12 text-lg text-gray-400"><i className="bx bx-shopping-bag"></i></span>
                                            <span className="text-sm font-medium">Subscription's</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={"/watch-history"} href="#" className="flex flex-row hover:border  px-4 border-gray-600 rounded-3xl items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                            <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-chat"></i></span>
                                            <span className="text-sm font-medium">Watch-History</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={"/userchannelstatus"} href="#" className="flex flex-row hover:border  px-4 border-gray-600 rounded-3xl items-center h-12 transform dark:text-white text-gray-900 hover:text-gray-500">
                                            <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-user"></i></span>
                                            <span className="text-sm font-medium">Channal Status</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <div onClick={handlelogout} href="#" className="flex flex-row hover:border  px-4 hover:border-gray-600 rounded-3xl items-center h-12 transform  dark:text-white text-gray-900 hover:text-gray-500">
                                            <span className="inline-flex items-center justify-center h-12  text-lg text-gray-400"><i className="bx bx-log-out"></i></span>
                                            <span className="text-sm font-medium">Logout</span>
                                        </div  >
                                    </li>
                                </>

                            ) : null
                        }
                    </ul>
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
                <div className='justify-center'>


                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

// <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">5</span>