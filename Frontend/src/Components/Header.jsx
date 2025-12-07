import React, { useState, useEffect, useRef } from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    useToast,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Image,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'

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
import { useSelector } from 'react-redux';
import { extendTheme } from "@chakra-ui/react";
import { useDispatch } from 'react-redux'
import axios from "axios"
import { AuthLogin, AuthLogout } from '../Store/features/Slice.js';
import { Link, useNavigate } from 'react-router-dom';
function Header() {
    const toast = useToast();
    const [loginerror, setlogainerror] = useState({
        status: false,
        msg: ""
    });
    const [signinerror, setsigninerror] = useState({
        status: false,
        msg: ""
    });
    const navigate = useNavigate();
    const { status, userdata } = useSelector((state) => state.auth);
    const { isOpen: isOpenLogin, onOpen: onOpenLogin, onClose: onCloseLogin } = useDisclosure();
    const [authtypelogin, setauthtypelogin] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [debouncingData, setDebouncingData] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Ref to keep track of the latest searchText
    const searchTextRef = useRef(searchText);
    searchTextRef.current = searchText;

    const getSearch = async () => {
        setSearchLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/search?s=${searchTextRef.current}&limit=15&page=1`);
            setDebouncingData(response.data.data.data);
            // console.log(debouncingData);
        } catch (err) {
            setDebouncingData([])
            // console.log(err);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    const handleSearchText = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            getSearch();
        }, 300);

        setDebounceTimeout(newTimeout);
    };

    const theme = extendTheme({
        components: {
            Drawer: {
                baseStyle: {
                    dialog: {
                        bg: isDarkMode ? "black" : "white",
                        color: isDarkMode ? "white" : "black",
                    },
                },
            },
        },
    });

    const [loginform, setloginform] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: '',
        fullname: '',
        avatar: null, // Added avatar state
        coverImage: null, // Added coverImage state
    });

    useEffect(() => {
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.add('light');
            setIsDarkMode(false);
        } else if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };


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


    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setRegisterForm({
            ...registerForm,
            [name]: files[0], // Updated to handle both avatar and coverImage
        });
    };


    const handlesloginsubmit = async (e) => {
        e.preventDefault();

        setlogainerror({
            status: false,
            msg: ""
        });

        const toastId = toast({
            title: "Logging in...",
            description: "Please wait while we log you in.",
            status: "loading",
            duration: null,
            isClosable: true,
            position: "top",
        });

        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/login`, { ...loginform, email: loginform.username }, {
                withCredentials: true
            });

            dispatch(AuthLogin(res.data.data.user));
            localStorage.setItem("refreshToken", res.data.data.refreshToken);

            toast.update(toastId, {
                title: "Login successful.",
                description: "You have successfully logged in.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onCloseLogin();
            setsigninerror({
                status: false,
                msg: ""
            })
            setRegisterForm({
                username: '',
                email: '',
                password: '',
                fullname: '',
                avatar: null,
                coverImage: null,
            })
            setlogainerror({
                status: false,
                msg: ""
            });
            setloginform({
                username: '',
                email: '',
                password: '',
            });
        } catch (error) {
            setlogainerror({
                status: true,
                msg: error.response.data.errors
            });

            toast.update(toastId, {
                title: "Login failed.",
                description: error.response?.data?.errors || "An error occurred during login.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            console.log(error.response.data.errors);
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', registerForm.username);
        formData.append('email', registerForm.email);
        formData.append('password', registerForm.password);
        formData.append('fullname', registerForm.fullname);
        formData.append('avatar', registerForm.avatar);
        formData.append('coverImage', registerForm.coverImage);

        console.log(formData);

        setsigninerror({
            status: false,
            msg: ""
        });

        const toastId = toast({
            title: "Processing...",
            description: "Please wait while we process your registration.",
            status: "loading",
            duration: null,
            isClosable: true,
            position: "top",
        });

        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            dispatch(AuthLogin(response.data.data.user));
            localStorage.setItem("refreshToken", response.data.data.refreshToken);

            toast.update(toastId, {
                title: "Registration successful.",
                description: "You have successfully registered.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onCloseLogin();
            console.log(response.data);
            setsigninerror({
                status: false,
                msg: ""
            })
            setRegisterForm({
                username: '',
                email: '',
                password: '',
                fullname: '',
                avatar: null,
                coverImage: null,
            })
            setlogainerror({
                status: false,
                msg: ""
            });
            setloginform({
                username: '',
                email: '',
                password: '',
            });
        } catch (error) {
            console.log(error);
            setsigninerror({
                status: true,
                msg: error?.response?.data?.errors || "Cannot login now. Please try again."
            });

            toast.update(toastId, {
                title: "Registration failed.",
                description: error.response?.data?.errors || "An error occurred during registration.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            console.log(error);
        }
    };

    const handleclickondeboucneitem = (value) => {
        navigate(`/search?s=${value}`)
        setDebouncingData([]);

    }
    const handlesearchsubmit = (e) => {
        e.preventDefault();
        navigate(`/search?s=${searchText}`)
        setDebouncingData([]);

    }



    return (
        <>
            <header className="fixed w-full sm:ml-[20vw]  bg-cyan-200 dark:bg-black dark:text-white  z-10">

                <div className="md:w-[50vw] w-[100vw] px-2 h-20 flex items-center md:gap-32 justify-between  sm:px-8 dark:bg-black dark:text-white text-black">

                    <IconMenu2 onClick={onOpen} className="sm:hidden  text-black-700 right-2 dark:text-neutral-200 h-10 w-10 flex-shrink-0" />

                    <div class="items-center justify-center xl:p-5">
                        <div className="flex items-center justify-center">
                            <div className="flex w-full md:w-[45vw] min-w-[70vw] sm:min-w-[45vw] lg:w-[40vw] xl:w-[50vw] duration-[500ms] border dark:border-gray-700 border-gray-300 bg-gradient-to-r from-gray-100/50 to-gray-300/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-lg rounded-lg shadow-md hover:shadow-lg transition-all">

                                {/* Search Input */}
                                <form className="flex items-center w-full" onSubmit={handlesearchsubmit}>
                                    <input
                                        value={searchText}
                                        onChange={handleSearchText}
                                        placeholder="Search"
                                        type="text"
                                        className="flex-1 bg-transparent w-full focus:outline-none px-4 py-2 text-sm sm:text-base dark:text-white text-gray-800 placeholder-gray-400 dark:placeholder-gray-600"
                                    />
                                </form>

                                {/* Search Button */}
                                <button
                                    onClick={handlesearchsubmit}
                                    className="flex items-center justify-center w-10 h-10 rounded-tr-lg rounded-br-lg bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-purple-600 dark:to-blue-600 hover:from-indigo-600 hover:to-cyan-600 dark:hover:from-purple-700 dark:hover:to-blue-700 transition-all text-white"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                    >
                                        <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
                                    </svg>
                                </button>

                            </div>
                        </div>

                        <div className="searchbox flex flex-col mt-2 items-left absolute md:w-[25vw] sm:w-[25vw] lg:w-[40vw] xl:w-[50vw] z-51">
                            {
                                debouncingData.slice(0, 9).map((element) => (
                                    <div onClick={() => handleclickondeboucneitem(element.tittle || element.username || element.content)} className='p-2 border rounded-lg'>
                                        {element.tittle || element.username || element.content}
                                    </div>
                                ))
                            }
                            {
                                searchLoading && <div className='p-2 w-full rounded-lg'>Loading...</div>
                            }
                        </div>
                    </div>
                    <div className="flex justify-center md:gap-2 align-end left-0 items-center">
                        <div className='sm:block hidden mx-3'>
                            <label className="switch">
                                <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                                <span className="slider round"></span>
                            </label>
                        </div>


                        <label
                            for="profile"
                            class="relative flex  w-full h-16    group  flex-row gap-3 items-center justify-center text-black rounded-xl"
                        >

                            {

                                !status ? (
                                    <>
                                        <svg
                                            onClick={onOpenLogin}
                                            className="peer-hover/expand:scale-125  dark:fill-white peer-hover/expand:text-blue-400 peer-hover/expand:fill-blue-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
                                            ></path>
                                        </svg>
                                    </>
                                ) : (

                                    <Link to={`/user/userprofile/${userdata?.username}`}>
                                        <div className='z-88  w-[30px] relative text-white'>
                                            <img className='relative w-[30px] h-[30px] rounded-2xl text-white' src={userdata.avatar.url} alt="img" />
                                        </div>
                                    </Link>

                                )
                            }
                        </label>
                        <Link to={'/user/editprofile'}>
                            <label
                                for="settings"
                                class="relative sm:flex hidden w-full h-16 p-4 ease-in-out duration-300 border-solid border-black/10 group  flex-row gap-3 items-center justify-center text-black rounded-xl"
                            >
                                <input
                                    class="hidden peer/expand"
                                    type="radio"
                                    name="path"
                                    id="settings"
                                />
                                <svg
                                    class="peer-hover/expand:scale-125 dark:fill-white peer-hover/expand:text-blue-400 peer-hover/expand:fill-blue-400 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"
                                    ></path>
                                    <path
                                        d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"
                                    ></path>
                                </svg>
                            </label>
                        </Link>
                    </div>
                </div>
            </header>
            <div>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    theme={theme}

                >
                    <DrawerOverlay />
                    <DrawerContent className='-ml-4 border-r-2 '>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Link to={"/"} className="flex px-10 mt-4 gap-2 items-center">
                                <img className="w-10 h-10" src="/logohbhai.png" alt="" />
                                <h1 class="text-3xl font-display font-bold text-primary-600">
                                    VibeSocial
                                </h1>
                            </Link>
                        </DrawerHeader>

                        <DrawerBody className="">
                            <ul className="space-y-3">
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

                                    </>
                                )}
                            </ul>
                        </DrawerBody>
                        <DrawerFooter>
                            <div className='flex px-4 w-full justify-between items-center mb-4'>
                                DarkMode :
                                <label className="switch">
                                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {status && (
                                <>

                                    <div
                                        onClick={handlelogout}
                                        className="flex items-center px-4 py-3 rounded-lg  dark:text-white text-gray-900 hover:text-blue-500 dark:hover:text-blue-500 cursor-pointer"
                                    >
                                        <IconLogout2 className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 font-display font-bold text-primary-600">Logout</span>
                                    </div>

                                </>
                            )}
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            <Modal onClose={onCloseLogin} isOpen={isOpenLogin} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody className="dark:bg-black p-0 bg-white">
                        {authtypelogin ? (
                            <div className="">
                                <section className="rounded-md p-2 text-black dark:text-white dark:bg-black bg-white">
                                    <div className="flex items-center justify-center my-3">
                                        <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
                                            <div className="mb-2"></div>
                                            <h2 className="text-2xl font-bold leading-tight">
                                                <span >Sign up</span> to Create
                                                account
                                            </h2>
                                            <p className="mt-2 text-base dark:text-white text-black">
                                                Already have an account?{' '}
                                                <span onClick={() => setauthtypelogin(false)}>Login-In</span>

                                            </p>

                                            <form className="mt-5" onSubmit={handleSubmit}>
                                                <div className="space-y-4">
                                                    <div>

                                                        {signinerror.status && <h2>{signinerror.msg}</h2>}
                                                        <label className="text-base font-mediumtext-black dark:text-white">
                                                            Fullname
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Full Name"
                                                                type="text"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="fullname"
                                                                required
                                                                value={registerForm.fullname}
                                                                onChange={(e) =>
                                                                    setRegisterForm({
                                                                        ...registerForm,
                                                                        fullname: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-base font-mediumtext-black dark:text-white">
                                                            User Name
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Username"
                                                                type="text"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="username"
                                                                required
                                                                value={registerForm.username}
                                                                onChange={(e) =>
                                                                    setRegisterForm({
                                                                        ...registerForm,
                                                                        username: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-base font-mediumtext-black dark:text-white">
                                                            Email Address
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Email"
                                                                type="email"
                                                                required
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="email"
                                                                value={registerForm.email}
                                                                onChange={(e) =>
                                                                    setRegisterForm({
                                                                        ...registerForm,
                                                                        email: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-base font-mediumtext-black dark:text-white">
                                                                Password
                                                            </label>
                                                        </div>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Password"
                                                                type="password"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="password"
                                                                required
                                                                value={registerForm.password}
                                                                onChange={(e) =>
                                                                    setRegisterForm({
                                                                        ...registerForm,
                                                                        password: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-base font-medium text-black dark:text-white">
                                                            Avatar
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="file"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="avatar"
                                                                required
                                                                onChange={handleFileChange} // Ensure handleFileChange handles this input
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <button
                                                            className="inline-flex w-full text-white dark:text-black items-center justify-center rounded-md bg-black dark:bg-white px-3.5 py-2.5 font-semibold leading-7 dark:hover:bg-white/80 hover:bg-black/80"
                                                            type="submit"
                                                        >
                                                            Create Account
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="">
                                <section className="rounded-md p-2 text-black dark:text-white dark:bg-black bg-white">
                                    <div className="flex items-center justify-center my-3">
                                        <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
                                            <div className="mb-2"></div>
                                            <h2 className="text-2xl font-bold leading-tight">
                                                Already Have a Account Login
                                            </h2>
                                            <p className="mt-2 text-base dark:text-white text-black">
                                                Don't have a Account? {' '}
                                                <span onClick={() => setauthtypelogin(true)}>Sign Up</span>
                                            </p>

                                            <form className="mt-5" onSubmit={handlesloginsubmit}>
                                                <div className="space-y-4">

                                                    <div>
                                                        <label className="text-base font-mediumtext-black dark:text-white">
                                                            Email address or Username
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Email Or Username"
                                                                type="text"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="username"
                                                                value={loginform.username}
                                                                onChange={(e) => setloginform({ ...loginform, username: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-base font-mediumtext-black dark:text-white">
                                                                Password
                                                            </label>
                                                        </div>
                                                        <div className="mt-2">
                                                            <input
                                                                placeholder="Password"
                                                                type="password"
                                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                                                name="password"
                                                                value={loginform.password}
                                                                onChange={(e) => setloginform({ ...loginform, password: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                                            type="submit"
                                                        >
                                                            Login
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Header;
