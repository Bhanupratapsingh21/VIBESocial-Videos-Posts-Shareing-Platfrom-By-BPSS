import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthLogout } from '../Store/features/Slice';
import axios from 'axios';
import { useToast } from "@chakra-ui/react";

import {
    IconArrowLeft,
    IconBrandStocktwits,
    IconMenu2,
    IconUpload,
    IconLogout2,
    IconHistory,
    IconBrandStripe,
    IconPlaylist,
    IconVideoPlus,
    IconDatabaseImport,
    IconHome,
} from "@tabler/icons-react";
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
        <aside className="fixed hidden sm:block left-0 top-0 h-screen w-[21vw] bg-cyan-200  dark:bg-black text-black dark:text-white z-10">
            <div className="min-h-screen flex flex-col bg-cyan-200 dark:bg-black">
                {/* Top Section: Logo */}
                <div className="flex items-center justify-start px-12 h-20">

                    <Link to={"/"} className="flex mt-4 gap-2 items-center">
                        <img className="w-10 h-10" src="/logohbhai.png" alt="" />
                        <h1 class="text-3xl font-display font-bold text-primary-600">
                            VibeSocial
                        </h1>
                    </Link>
                </div>
                <div className="flex-1 mt-6 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to={"/"}
                                className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                            >
                                <IconHome className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 font-display font-bold text-primary-600">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/upload"}
                                className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                            >
                                <IconUpload className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 font-display font-bold text-primary-600">Upload</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/videos"}
                                className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                            >
                                <IconVideoPlus className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 font-display font-bold text-primary-600">Videos</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/tweets"}
                                className="flex items-center px-4 py-3 rounded-lg dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                            >
                                <IconBrandStocktwits className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                <span className="ml-3 font-display font-bold text-primary-600">Tweets</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={"/playlist"}
                                className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                            >
                                <IconPlaylist className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />

                                <span className="ml-3 font-display font-bold text-primary-600">Playlists</span>
                            </Link>
                        </li>

                        {/* Conditional Links */}
                        {status && (
                            <>
                                <li>
                                    <Link
                                        to={"/subscription"}
                                        className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                                    >
                                        <IconBrandStripe className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 font-display font-bold text-primary-600">Subscriptions</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/watch-history"}
                                        className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                                    >
                                        <IconHistory className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 font-display font-bold text-primary-600">Watch History</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/userchannelstatus"}
                                        className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500"
                                    >
                                        <IconDatabaseImport className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 font-display font-bold text-primary-600">Channel Status</span>
                                    </Link>
                                </li>
                                <li>
                                    <div
                                        onClick={handlelogout}
                                        className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer"
                                    >
                                        <IconLogout2 className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"  />
                                        <span className="ml-3 font-display font-bold text-primary-600">Logout</span>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Bottom Section: Footer */}
                <footer className="">
                    <div className="p-2 text-center">
                        <p className="text-sm font-display font-bold text-primary-600 text-black dark:text-white">
                            <span className="text-blue-500"></span>Made with{" "}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="red"
                                aria-hidden="true"
                                className="inline-block w-4 h-4"
                            >
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
                            </svg>{" "}
                            by{" "}
                            <a
                                href="https://url-shortner-mern-uetd.onrender.com/Js0GzP6A"
                                target="_blank"
                                className="hover:text-blue-500"
                            >
                                BPSS
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </aside>

    );
}

export default Sidebar;

// <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">5</span>
