import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import TweetsLeyout from '../Components/TweetsLeylot.jsx';
import VideosLeyout from '../Components/Videosleylot.jsx';
import Loadingvideo from '../Components/Videosloading.jsx';
import { Link } from "react-router-dom";

function Searchforall() {
    const [tweetdata, settweetdata] = useState([]);
    const [Videodata, setVideodata] = useState([]);
    const [userdata, setuserdata] = useState([]);
    const [tweeterror, settweeterror] = useState(false);
    const [videoerror, setvideoerror] = useState(false);
    const [usererror, setusererror] = useState(false);
    const [tweetloading, settweetloading] = useState(false);
    const [videoloading, setvideoloading] = useState(false);
    const [userloading, setuserloading] = useState(false);
    const [tweetPage, setTweetPage] = useState(1);
    const [videoPage, setVideoPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [hasMoreTweets, setHasMoreTweets] = useState(true);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('s'); // Get the value of 's'

    const getvideodata = async (page) => {
        if (!hasMoreVideos) return;
        setvideoloading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/search/videos?s=${searchQuery}&limit=10&page=${page}`);
            setVideodata(prev => [...prev, ...response.data.data.videos]);
            setHasMoreVideos(response.data.data.videos.length > 0);
        } catch (error) {
            // console.log(error);
            setvideoerror(true);
        } finally {
            setvideoloading(false);
        }
    };

    const gettweetsdata = async (page) => {
        if (!hasMoreTweets) return;
        settweetloading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/search/tweets?s=${searchQuery}&limit=10&page=${page}`, { withCredentials: true });
            settweetdata(prev => [...prev, ...response.data.data.tweets]);
            setHasMoreTweets(response.data.data.tweets.length > 0);
        } catch (error) {
            // console.log(error);
            settweeterror(true);
        } finally {
            settweetloading(false);
        }
    };

    const getusersdata = async (page) => {
        if (!hasMoreUsers) return;
        setuserloading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/search/users?s=${searchQuery}&limit=10&page=${page}`);
            setuserdata(prev => [...prev, ...response.data.data.users]);
            setHasMoreUsers(response.data.data.users.length > 0);
        } catch (error) {
            setusererror(true);
        } finally {
            setuserloading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery) return;

        // Reset state when search query changes
        setuserdata([]);
        settweetdata([]);
        setVideodata([]);
        setUserPage(1);
        setTweetPage(1);
        setVideoPage(1);
        setHasMoreUsers(true);
        setHasMoreTweets(true);
        setHasMoreVideos(true);
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery) return;

        getusersdata(userPage);
        gettweetsdata(tweetPage);
        getvideodata(videoPage);
    }, [searchQuery, userPage, tweetPage, videoPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 1000 > document.documentElement.offsetHeight) {
                if (!videoloading && hasMoreVideos) {
                    setVideoPage(prev => prev + 1);
                }
                if (!tweetloading && hasMoreTweets) {
                    setTweetPage(prev => prev + 1);
                }
                if (!userloading && hasMoreUsers) {
                    setUserPage(prev => prev + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [videoloading, tweetloading, userloading, hasMoreVideos, hasMoreTweets, hasMoreUsers]);

    const filterondelete = (_id) => {
        const newdata = data.filter(post => post._id !== _id);
        settweetdata(newdata);
    };

    return (
        <>
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    <Tab>Video's</Tab>
                    <Tab>Tweets</Tab>
                    <Tab>Users</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VideosLeyout videodata={Videodata} />
                        {videoloading && <Loadingvideo totalno={9} />}
                        {videoerror || Videodata.length === 0 && <div className="flex justify-center items-center">Not Found</div>}
                    </TabPanel>
                    <TabPanel>
                        <TweetsLeyout filterondelete={filterondelete} tweetsdata={tweetdata} />
                        {tweetloading && <Loadingvideo totalno={9} />}
                        {tweeterror || tweetdata.length === 0 && <div className="flex justify-center">Not Found</div>}
                    </TabPanel>
                    <TabPanel>
                        {
                            userdata.map((user) => (
                                <Link to={`/user/userprofile/${user.username}`} key={user._id}>
                                    <div className="sm:w-[65vw] flex justify-left items-center bg-clip-border rounded-xl dark:bg-black bg-white text-gray-700 dark:text-white shadow-md overflow-hidden xl:col-span-2">
                                        <div className="w-max flex justify-between bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none m-0 items-center p-6">
                                            <div>
                                                <img className="rounded-full mr-5 w-10" src={user.avatar.url} alt="img" />
                                            </div>
                                            <div>
                                                <h6 className="antialiased tracking-normal flex gap-2 items-center font-sans text-base font-semibold leading-relaxed  mb-1">{user.username}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className="h-4 w-4 text-blue-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                    </svg>
                                                </h6>
                                                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed mb-1">{user.fullname}</h6>
                                                <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                        {userloading && <Loadingvideo totalno={9} />}
                        {usererror || userdata.length === 0 && <div className="flex justify-center">Not Found</div>}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default Searchforall;