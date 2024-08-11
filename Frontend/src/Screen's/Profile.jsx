import {
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import Headertwo from '../Components/Header2';
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router"
import VideosLeyout from "../Components/Videosleylot";
import Loadingvideo from "../Components/Videosloading";
import TweetsLeyout from "../Components/TweetsLeylot.jsx";
import { useDispatch } from "react-redux";
import { AuthLogout } from "../Store/features/Slice.js";
function Profile() {
    const navigate = useNavigate();
    const toast = useToast();
    const { status, userdata } = useSelector((state) => state.auth);
    const [error, seterror] = useState({
        status: false,
        msg: ""
    });

    const [tweetData, setTweetData] = useState([]);
    const [tweetLoading, setTweetLoading] = useState(true);
    const [tweetError, setTweetError] = useState(false);
    const [tweetPage, setTweetPage] = useState(1);
    const [tweetTotalPages, setTweetTotalPages] = useState(1);
    const tweetObserver = useRef();
    const [loading, setlaoding] = useState(false);
    const [profile, setprofile] = useState({});
    const [form, setForm] = useState({ fullname: " ", email: "" });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', NewPassword: '' });
    const [avatar, setAvatar] = useState(null);
    const [error2, setError] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAvatarOpen, onOpen: onAvatarOpen, onClose: onAvatarClose } = useDisclosure();
    const [data, setdata] = useState([]);
    const [videoloading, setvideoloading] = useState(true);
    const [videoerror, setvideoerror] = useState(false);
    const [page, setpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const observer = useRef();
    const lastVideoElementRef = useRef();
    const lastTweetElementRef = useRef();
    const dispatch = useDispatch();


    const getdata = async (page) => {
        try {
            setvideoloading(true);
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/users/getvideos/${profile._id}?q=newestfirst&limit=10&page=${page}`, { withCredentials: true });
            const videos = response.data.data.videos;
            setdata(prevData => [...prevData, ...videos]);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.log(error);
            setvideoerror(true);
        } finally {
            setvideoloading(false);
        }
    };

    const getTweetData = async (page) => {
        try {
            setTweetLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/users/gettweetspublic/${profile._id}?q=newestfirst&limit=10&page=${page}`, { withCredentials: true });
            const tweets = response.data.data.blogs;
            setTweetData(prevData => {
                const posts = [...prevData, ...tweets];
                const seenIds = new Set();
                // Filter out duplicate posts based on _id
                const filteredData = posts.filter(post => {
                    if (seenIds.has(post._id)) {
                        return false;
                    } else {
                        seenIds.add(post._id);
                        return true;
                    }
                });
                return filteredData;
            });
            setTweetTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.log(error);
            setTweetError(true);
        } finally {
            setTweetLoading(false);
        }
    };

    const filterOnDelete = (_id) => {
        const newdata = tweetData.filter(post => post._id !== _id)
        setTweetData(newdata);
    }

    const getuser = async () => {
        setlaoding(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/users/getuser/${userdata.username}`, { withCredentials: true });
            setprofile(response.data.data)
            setForm({
                fullname: response?.data.data.fullname,
                email: response?.data.data.email
            })
            //console.log(response.data.data)
        } catch (error) {
            seterror({
                status: true,
                msg: error?.response.data.msg || "Unexpect Error Occered Pls Try Again"
            });
            console.log(error);
        } finally {
            setlaoding(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast({
            status: "loading",
            title: "Updating Details Wait",
            description: "Pls Wait We Are Doing",
            duration: 2000,
            position: "top",
            isClosable: true
        })
        try {
            await axios.patch(`${import.meta.env.VITE_URL}/api/v1/users/update-account`, form, { withCredentials: true });
            setError(null);
            toast({
                status: "success",
                title: "User Details Updated Successfully",
                duration: 2000,
                position: "top",
                isClosable: true
            })
            onClose();
            getuser();
        } catch (error) {
            // console.log(error);
            //setError(error.response.data.errors);
            toast({
                status: "error",
                title: error.response.data.errors || "Error While Updating Details",
                description: "Pls try again",
                duration: 3000,
                position: "top",
                isClosable: true
            })
        }
    };

    const handlelogout = async () => {

        try {
            const logout = await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/logout`, {}, {
                withCredentials: true
            })
            if (logout.data.success === true) {
                localStorage.removeItem("refreshToken")
                dispatch(AuthLogout());

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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        toast({
            status: "loading",
            title: "Updating Password Wait",
            description: "Pls Wait We Are Doing",
            duration: 2000,
            position: "top",
            isClosable: true
        })
        try {
            await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/change-password`, passwordForm, { withCredentials: true });
            setError(null);
            toast({
                status: "success",
                title: "Password Updateed Successfully",
                duration: 2000,
                description: "Pls Login Again",
                position: "top",
                isClosable: true
            })
            onClose();
            navigate('/');
            handlelogout();


        } catch (error) {
            toast({
                status: "error",
                title: error.response.data.errors || "Error While Updating Password",
                description: "Pls try again",
                duration: 3000,
                position: "top",
                isClosable: true
            })
        }
    };

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        toast({
            status: "loading",
            title: "Updating Profile Pic Wait",
            description: "Pls Wait We Are Doing",
            duration: 2000,
            position: "top",
            isClosable: true
        })
        const formData = new FormData();
        formData.append('avatar', avatar);
        try {
            await axios.patch(`${import.meta.env.VITE_URL}/api/v1/users/avatar`, formData, { withCredentials: true });
            setError(null);
            toast({
                status: "success",
                title: "Profile Pic Updated Successfully",
                duration: 2000,
                position: "top",
                isClosable: true
            })
            getuser();
            onAvatarClose();
        } catch (error) {
            toast({
                status: "error",
                title: error.response.data.errors || "Error While Updating Profile Pic",
                description: "Pls Wait We Are Doing",
                duration: 3000,
                position: "top",
                isClosable: true
            })
        }
    };

    useEffect(() => {
        if (status) {
            getuser();
        }
    }, [status]);

    useEffect(() => {
        if (profile._id) {
            getdata(page); // for video
        }
    }, [page, profile]);

    useEffect(() => {
        if (profile._id) {
            getTweetData(tweetPage);
        }
    }, [tweetPage, status, profile]);

    // 

    useEffect(() => {
        if (tweetLoading) return;
        if (tweetObserver.current) tweetObserver.current.disconnect();
        tweetObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && tweetPage < tweetTotalPages) {
                setTweetPage(prevPage => prevPage + 1);
            }
        });
        if (lastTweetElementRef.current) {
            tweetObserver.current.observe(lastTweetElementRef.current);
        }
    }, [tweetLoading, tweetPage, tweetTotalPages]);

    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages) {
                setpage(prevPage => prevPage + 1);
            }
        });
        if (lastVideoElementRef.current) {
            observer.current.observe(lastVideoElementRef.current);
        }
    }, [loading, page, totalPages]);


    return (
        <>  
            <Headertwo/>
            {
                loading && <div className="flex justify-center text-lg items-center">
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
                </div>
            }
            {
                !loading && profile.avatar && !error.status && (
                    <>
                        <div className="md:flex flex-row rounded-lg border border-transparent dark:bg-black bg-white sm:p-6">
                            <div onClick={onAvatarOpen} className="flex justify-between items-top">
                                <div className="relative">
                                    <img className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover" src={profile.avatar.url} alt="User" />
                                </div>
                            </div>

                            <div className="flex flex-col mt-2 sm:px-6">
                                <div className="flex h-8 flex-row">
                                    <a href="https://bhanu-pratap-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
                                        <h2 className="text-lg font-semibold">{profile.username}</h2>
                                    </a>
                                    <svg className="my-auto ml-2 h-5 fill-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                                    </svg>
                                </div>

                                <div className="flex flex-row space-x-2">
                                    <div className="flex flex-row">
                                        <svg className="mr-2 h-6 sm:h-4 w-4 fill-black dark:fill-gray-500/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                                        </svg>
                                        <div className="text-sm md:text-xs text-black dark:text-gray-400/80 hover:text-gray-400">{profile.fullname}</div>
                                    </div>
                                    <div className="flex flex-row">
                                        <svg className="mr-2 h-6 md:h-4 w-4 fill-black dark:fill-gray-500/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.15,14.21 17.42,14.5C17.7,14.77 18.06,14.95 18.5,15C18.91,15 19.25,14.85 19.5,14.58C19.77,14.31 19.95,13.95 20,13.5V12C20,9.97 19.21,8.21 17.66,6.66C16.11,5.11 14.35,4.34 12.31,4.34C10.31,4.34 8.56,5.11 7,6.66C5.44,8.21 4.66,9.97 4.66,12V13.5C4.66,14.31 4.95,15 5.5,15.58C6.05,16.17 6.73,16.5 7.5,16.5C8.1,16.5 8.67,16.31 9.19,15.94L9.89,16.58L10.3,16.93C10.7,17.25 11.17,17.4 11.66,17.4C12.15,17.4 12.61,17.25 13.02,16.94L13.71,16.58C14.27,16.94 14.9,17.15 15.5,17.15C16.27,17.15 16.95,16.83 17.5,16.24C18.05,15.65 18.34,14.97 18.34,14.24V12C18.34,10.35 17.73,8.85 16.56,7.68C15.39,6.5 13.88,5.9 12.31,5.9C10.78,5.9 9.35,6.5 8.23,7.68C7.11,8.85 6.5,10.35 6.5,12V13.45C6.5,14.05 6.66,14.58 6.94,15.03C7.22,15.47 7.63,15.8 8.19,15.9C8.69,15.9 9.12,15.69 9.5,15.37L9.89,15.02C10.34,15.36 10.81,15.58 11.31,15.58C11.82,15.58 12.28,15.35 12.66,14.94C13.05,14.52 13.27,14.03 13.34,13.45C13.36,13.21 13.37,12.97 13.37,12.73V12C13.37,11.05 13,10.27 12.39,9.66C11.78,9.05 11,8.68 10.03,8.66C9.07,8.68 8.29,9.05 7.68,9.66C7.07,10.27 6.7,11.05 6.68,12C6.68,12.54 6.84,13.04 7.14,13.47C7.44,13.9 7.83,14.21 8.28,14.37L8.89,13.58C9.12,13.34 9.46,13.18 9.81,13.18C10.16,13.18 10.49,13.34 10.73,13.58C11.2,14.03 12.23,14.03 12.7,13.58L13.26,13.03C13.5,12.79 13.84,12.63 14.19,12.63C14.54,12.63 14.87,12.79 15.11,13.03C15.28,13.2 15.44,13.31 15.59,13.37C15.84,13.47 16.14,13.5 16.44,13.44C16.73,13.39 17,13.25 17.25,13.03C17.5,12.82 17.64,12.52 17.68,12.19C17.68,12.12 17.67,12.04 17.66,11.97V12C17.66,10.96 17.3,10.04 16.58,9.32C15.87,8.61 14.94,8.24 13.9,8.24C12.86,8.24 11.93,8.61 11.22,9.32C10.5,10.04 10.13,10.96 10.13,12C10.13,12.65 10.32,13.24 10.7,13.71C11.07,14.18 11.64,14.46 12.3,14.5C12.96,14.53 13.53,14.24 13.89,13.79C14.24,13.35 14.46,12.72 14.54,12.05C14.6,11.51 14.44,10.96 14.09,10.51C13.73,10.05 13.17,9.78 12.56,9.8C11.96,9.78 11.41,10.05 11.05,10.51C10.7,10.97 10.54,11.52 10.59,12.05C10.66,12.72 10.87,13.36 11.23,13.8C11.6,14.25 12.17,14.53 12.83,14.5C13.5,14.46 14.07,14.18 14.44,13.71C14.82,13.24 15.01,12.65 15.01,12V12Z" />
                                        </svg>
                                        <div className="text-sm md:text-xs text-black dark:text-gray-400/80 hover:text-gray-400">{profile.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={onOpen} class="w-100 sm:w-25 dark:bg-white dark:sm:bg-black sm:bg-white bg-black rounded-xl  flex flex-grow flex-col mt-3 items-start md:items-end justify-start">
                                <div class="flex flex-row">
                                    <button
                                        class="flex text-center justify-center items-center rounded-md md:w-max w-[90vw] py-2 px-4 text-white transition-all duration-150 ease-in-out">
                                        <svg class="w-6 dark:stroke-black dark:sm:stroke-white sm:stroke-black stroke-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Tabs className="-ml-4 mt-4 fixed sm:w-max w-[100vw]" isFitted variant='enclosed'>
                            <TabList mb='1em'>
                                <Tab>Video's</Tab>
                                <Tab>Tweets</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <VideosLeyout videodata={data} />
                                    {videoloading && <Loadingvideo totalno={9} />}
                                    <div ref={lastVideoElementRef} />
                                    {videoerror && <div className="flex sm:w-[70vw] w-max justify-center items-center">User Don't Have Any Video's</div>}
                                </TabPanel>
                                <TabPanel>
                                    <div className="sm:w-[70vw] w-[100vw] -ml-4 sm:ml-0 justify-center">
                                        <TweetsLeyout filterondelete={filterOnDelete} tweetsdata={tweetData} />
                                        {tweetLoading && <Loadingvideo totalno={9} />}
                                        <div ref={lastTweetElementRef} />
                                        {tweetError && <div className="flex sm:w-[70vw] w-max justify-center">User Don't Have Any Tweets's</div>}
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent className="bg-white dark:bg-black text-black dark:text-white">
                                <ModalHeader>Edit User Details</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Tabs isFitted variant='enclosed'>
                                        <TabList>
                                            <Tab>Details</Tab>
                                            <Tab>Password</Tab>
                                        </TabList>

                                        <TabPanels>
                                            <TabPanel>
                                                {error2 && (
                                                    <Alert status="error">
                                                        <AlertIcon />
                                                        {error}
                                                    </Alert>
                                                )}
                                                <form onSubmit={handleSubmit}>
                                                    <FormControl>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <Input
                                                            type="text"
                                                            name="fullname"
                                                            value={form.fullname}
                                                            onChange={handleInputChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl mt={4}>
                                                        <FormLabel>Email</FormLabel>
                                                        <Input
                                                            type="email"
                                                            name="email"
                                                            value={form.email}
                                                            onChange={handleInputChange}
                                                        />
                                                    </FormControl>
                                                    <Button mt={4} colorScheme="blue" type="submit">Save</Button>
                                                </form>
                                            </TabPanel>
                                            <TabPanel>
                                                <form onSubmit={handlePasswordSubmit}>
                                                    <FormControl>
                                                        <FormLabel>Old Password</FormLabel>
                                                        <Input
                                                            type="password"
                                                            name="oldPassword"
                                                            value={passwordForm.oldPassword}
                                                            onChange={handlePasswordChange}
                                                        />
                                                    </FormControl>
                                                    <FormControl mt={4}>
                                                        <FormLabel>New Password</FormLabel>
                                                        <Input
                                                            type="password"
                                                            name="NewPassword"
                                                            value={passwordForm.NewPassword}
                                                            onChange={handlePasswordChange}
                                                        />
                                                    </FormControl>
                                                    <Button mt={4} colorScheme="blue" type="submit">Change Password</Button>
                                                </form>
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="ghost" onClick={onClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <Modal isOpen={isAvatarOpen} onClose={onAvatarClose}>
                            <ModalOverlay />
                            <ModalContent className="bg-white dark:bg-black text-black dark:text-white">
                                <ModalHeader>Change Avatar</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    {error2 && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            {error}
                                        </Alert>
                                    )}
                                    <form onSubmit={handleAvatarSubmit}>
                                        <FormControl>
                                            <FormLabel>Profile File</FormLabel>
                                            <input
                                                className="flex justify-center items-center"
                                                type="file"
                                                name="avatar"
                                                onChange={handleAvatarChange}
                                            />
                                        </FormControl>
                                        <Button mt={4} colorScheme="blue" type="submit">Upload</Button>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="ghost" onClick={onAvatarClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </>
                )
            }


        </>
    )
}
export default Profile