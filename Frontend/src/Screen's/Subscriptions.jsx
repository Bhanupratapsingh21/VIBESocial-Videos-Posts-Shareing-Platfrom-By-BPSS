import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

function Subscription() {
    const { status, userdata } = useSelector((state) => state.auth);
    const [Subscribeddata, setSubscribeddata] = useState([]);
    const [subscribersdata, setSubscribersdata] = useState([]);
    const [Subscribederror, setSubscribederror] = useState();
    const [Subscribererror, setSubscribererror] = useState();
    const [subscribedPage, setSubscribedPage] = useState(1);
    const [subscribersPage, setSubscribersPage] = useState(1);
    const [totalSubscribedPages, setTotalSubscribedPages] = useState(1);
    const [totalSubscribersPages, setTotalSubscribersPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const observer = useRef();

    useEffect(() => {
        if (status) {
            getsubscribeddata(subscribedPage);
            getsubscribersdata(subscribersPage);
        }
    }, [status, subscribedPage, subscribersPage]);

    const getsubscribersdata = async (page) => {
        try {
            setLoading(true);
            const response = await axios(`${import.meta.env.VITE_URL}/api/v1/subscriptions/getsubscribers/${userdata._id}?page=${page}`, { withCredentials: true });
            setSubscribersdata(prev => [...prev, ...response.data.data.subscribers]);
            setTotalSubscribersPages(response.data.data.totalPages);
            console.log(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response.data.statusCode) {
                setSubscribererror(error.response.data.errors || "Error While Getting Subscribers");
            } else {
                toast({
                    status: "error",
                    title: error.response.data.errors || "Error While Getting Subscribers",
                    description: "Please wait, we are doing.",
                    duration: 3000,
                    position: "top",
                    isClosable: true
                });
            }
        }
    };

    const getsubscribeddata = async (page) => {
        try {
            setLoading(true);
            const response = await axios(`${import.meta.env.VITE_URL}/api/v1/subscriptions/SubscribedChannels/${userdata._id}?page=${page}`, { withCredentials: true });
            setSubscribeddata(prev => [...prev, ...response.data.data.SubscribedChannels]);
            setTotalSubscribedPages(response.data.data.totalPages);
            console.log(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response.data.statusCode) {
                setSubscribederror(error.response.data.errors || "Error While Getting Subscribed Channels");
            } else {
                toast({
                    status: "error",
                    title: error.response.data.errors || "Error While Getting Subscribed Channels",
                    description: "Please wait, we are doing.",
                    duration: 3000,
                    position: "top",
                    isClosable: true
                });
            }
        }
    };

    const lastSubscribedElementRef = useCallback(node => {
        if (loading || subscribedPage >= totalSubscribedPages) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setSubscribedPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, subscribedPage, totalSubscribedPages]);

    const lastSubscriberElementRef = useCallback(node => {
        if (loading || subscribersPage >= totalSubscribersPages) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setSubscribersPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, subscribersPage, totalSubscribersPages]);

    return (
        <>
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    <Tab>Subscribed</Tab>
                    <Tab>Subscribers</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {
                            Subscribeddata && (
                                Subscribeddata.map((channel, index) => {
                                    if (Subscribeddata.length === index + 1) {
                                        return (
                                            <Link to={`/user/userprofile/${channel.ChannelDetails.username}`} ref={lastSubscribedElementRef} key={channel._id}>
                                                <div className="relative sm:w-[65vw] flex justify-left items-center bg-clip-border rounded-xl dark:bg-black bg-white text-gray-700 dark:text-white shadow-md overflow-hidden xl:col-span-2">
                                                    <div className="relative w-max flex justify-between bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none m-0 items-center p-6">
                                                        <div>
                                                            <img className="rounded-full mr-5 h-10 w-10" src={channel.ChannelDetails.avatar.url} alt="img" />
                                                        </div>
                                                        <div>
                                                            <h6 className="antialiased tracking-normal flex gap-2 items-center font-sans text-base font-semibold leading-relaxed  mb-1">{channel.ChannelDetails.username}
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className="h-4 w-4 text-blue-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                                </svg>
                                                            </h6>
                                                            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed mb-1">{channel.ChannelDetails.fullname}</h6>
                                                            <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                                {channel.ChannelDetails?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <Link to={`/user/userprofile/${channel.ChannelDetails.username}`} key={channel._id}>
                                                <div className="relative sm:w-[65vw] flex justify-left items-center bg-clip-border rounded-xl dark:bg-black bg-white text-gray-700 dark:text-white shadow-md overflow-hidden xl:col-span-2">
                                                    <div className="relative w-max flex justify-between bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none m-0 items-center p-6">
                                                        <div>
                                                            <img className="rounded-full mr-5 h-10 w-10" src={channel.ChannelDetails.avatar.url} alt="img" />
                                                        </div>
                                                        <div>
                                                            <h6 className="antialiased tracking-normal flex gap-2 items-center font-sans text-base font-semibold leading-relaxed  mb-1">{channel.ChannelDetails.username}
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className="h-4 w-4 text-blue-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                                </svg>
                                                            </h6>
                                                            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed mb-1">{channel.ChannelDetails.fullname}</h6>
                                                            <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                                {channel.ChannelDetails?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    }
                                })
                            )
                        }
                        {
                            Subscribederror && (
                                <div>{Subscribederror}</div>
                            )
                        }
                        {loading && <div>Loading...</div>}
                    </TabPanel>
                    <TabPanel>
                        {
                            subscribersdata && (
                                subscribersdata.map((channel, index) => {
                                    if (subscribersdata.length === index + 1) {
                                        return (
                                            <Link to={`/user/userprofile/${channel.SubscriberDetails.username}`} ref={lastSubscriberElementRef} key={channel._id}>
                                                <div className="relative sm:w-[65vw] flex justify-left items-center bg-clip-border rounded-xl dark:bg-black bg-white text-gray-700 dark:text-white shadow-md overflow-hidden xl:col-span-2">
                                                    <div className="relative w-max flex justify-between bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none m-0 items-center p-6">
                                                        <div>
                                                            <img className="rounded-full mr-5  h-10 w-10 " src={channel.SubscriberDetails.avatar.url} alt="img" />
                                                        </div>
                                                        <div>
                                                            <h6 className="flex items-center gap-2 antialiased tracking-normal font-sans text-base font-semibold leading-relaxed  mb-1">{channel.SubscriberDetails.username}
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className="h-4 w-4 text-blue-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                                </svg>
                                                            </h6>
                                                            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed mb-1">{channel.SubscriberDetails.fullname}</h6>
                                                            <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                                {channel.SubscriberDetails.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <Link to={`/user/userprofile/${channel.SubscriberDetails.username}`} key={channel._id}>
                                                <div className="relative sm:w-[65vw] flex justify-left items-center bg-clip-border rounded-xl dark:bg-black bg-white text-gray-700 dark:text-white shadow-md overflow-hidden xl:col-span-2">
                                                    <div className="relative w-max flex justify-between bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none m-0 items-center p-6">
                                                        <div>
                                                            <img className="rounded-full mr-5  h-10 w-10" src={channel.SubscriberDetails.avatar.url} alt="img" />
                                                        </div>
                                                        <div>
                                                            <h6 className="flex items-center gap-2 antialiased tracking-normal font-sans text-base font-semibold leading-relaxed  mb-1">{channel.SubscriberDetails.username}
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className="h-4 w-4 text-blue-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                                                                </svg>
                                                            </h6>
                                                            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed mb-1">{channel.SubscriberDetails.fullname}</h6>
                                                            <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                                                                {channel.SubscriberDetails.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    }
                                })
                            )
                        }
                        {
                            Subscribererror && (
                                <div>{Subscribererror}</div>
                            )
                        }
                        {loading && <div>Loading...</div>}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default Subscription;