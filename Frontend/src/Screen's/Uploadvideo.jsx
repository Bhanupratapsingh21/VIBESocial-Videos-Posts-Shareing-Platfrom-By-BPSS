import React, { useState } from 'react';
import axios from 'axios';
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    Alert,
    AlertIcon,
    Progress,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import Headertwo from '../Components/Header2';
import { useSelector } from 'react-redux';
function Upload() {
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [tweetLoading, setTweetLoading] = useState(false);
    const [tweetProgress, setTweetProgress] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();
    const { status, userdata } = useSelector((state) => state.auth);
    const handleVideoUpload = async (e) => {
        e.preventDefault();
        if (status) {
            setVideoLoading(true);
            setVideoProgress(0);
            setError(null);

            const formData = new FormData(e.target);

            try {
                const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/videos/addvideo`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable
                            ? progressEvent.total
                            : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength) {
                            setVideoProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                        }
                    },
                });
                //console.log(response.data);

                toast({
                    title: "Completed",
                    description: "Your Video Upload SuccessFull",
                    status: "success",
                    duration: 2000,
                    position: "top",
                    isClosable: true,
                });
                navigate("/videos")
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.errors || 'An error occurred while uploading the video');
            } finally {
                setVideoLoading(false);
            }
        } else {
            toast({
                title: "Pls login Or Signup",
                description: "Pls Login and Signup",
                status: "error",
                duration: 2000,
                position: "top",
                isClosable: true,
            });
        }
    };

    const handleTweetUpload = async (e) => {
        e.preventDefault();
        if (status) {
            setTweetLoading(true);
            setTweetProgress(0);
            setError(null);

            const formData = new FormData(e.target);

            try {
                const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/tweets/uploadblog`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable
                            ? progressEvent.total
                            : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength) {
                            setTweetProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                        }
                    },
                });
                //console.log(response.data);
                toast({
                    title: "Completed",
                    description: "Your Tweet Upload SuccessFull",
                    status: "success",
                    duration: 2000,
                    position: "top",
                    isClosable: true,
                });
                navigate("/tweets")
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.errors || 'An error occurred while uploading the tweet');
            } finally {
                setTweetLoading(false);
            }
        } else {
            toast({
                title: "Pls login Or Signup",
                description: "Pls Login and Signup",
                status: "error",
                duration: 2000,
                position: "top",
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Headertwo />
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    <Tab>Video</Tab>
                    <Tab>Tweet</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <div className="flex flex-col justify-center py-6 sm:px-6 lg:px-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <div className="bg-white dark:bg-black dark:text-white text-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                    <form method="POST" action="#" onSubmit={handleVideoUpload}>
                                        <h2 className="text-2xl mb-3 font-bold leading-tight">
                                            Upload Video
                                        </h2>
                                        <div>
                                            <label className="block text-sm font-medium" htmlFor="title">
                                                Title
                                            </label>
                                            <div className="mt-1">
                                                <input className="appearance-none block dark:bg-black dark:text-white text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required type="text" name="tittle" id="tittle" />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium" htmlFor="description">
                                                Description
                                            </label>
                                            <div className="mt-1">
                                                <textarea className="bg-gray-100 w-full border dark:bg-black dark:text-white text-black  rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" name="description" required></textarea>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium" htmlFor="tags">
                                                Tags
                                            </label>
                                            <div className="mt-1">
                                                <input className="appearance-none dark:bg-black dark:text-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required type="text" name="tegs" id="tegs" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-left mt-6">
                                            <span className="mr-3 font-medium">isPublished:</span>
                                            <label className="inline-flex items-center">
                                                <input type="radio" className="form-radio dark:bg-black h-5 w-5 text-pink-600" name="isPublished" value="true" required />
                                                <span className="ml-2">True</span>
                                            </label>
                                            <label className="inline-flex items-center ml-6">
                                                <input type="radio" className="form-radio dark:bg-black h-5 w-5 text-purple-600" name="isPublished" value="false" required />
                                                <span className="ml-2">False</span>
                                            </label>
                                        </div>

                                        <div className="flex  items-center justify-center mt-6">
                                            <div className="flex items-center justify-between mt-3">
                                                <label className="text-base font-medium dark:text-white text-black">
                                                    Thumbnail
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input className="file-input dark:bg-black w-full max-w-xs" type="file" id="thumbnail" name="thumbnail" required />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center mt-6">
                                            <div className="flex items-center justify-between mt-3">
                                                <label className="text-base font-medium dark:text-white text-black">
                                                    Video
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input className="file-input dark:bg-black  w-full max-w-xs" type="file" accept="video/*" id="videofile" name="videofile" required />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" type="checkbox" name="terms" id="terms" required />
                                                <label className="ml-2 block text-sm" htmlFor="terms">
                                                    I agree to upload Video & Make It Available To Public To View And Download
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit">
                                                {videoLoading ? <Spinner size="sm" /> : 'Upload Video'}
                                            </button>
                                        </div>
                                    </form>
                                    {videoLoading && (
                                        <div className="mt-4">
                                            <Progress hasStripe isAnimated value={videoProgress} />
                                            <p className="text-center mt-2">{videoProgress}%</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="">
                            <section className="rounded-md p-2 dark:bg-black bg-white">
                                <div className="flex items-center justify-center my-3">
                                    <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
                                        <div className="mb-2"></div>
                                        <h2 className="text-2xl font-bold leading-tight">
                                            Upload Tweet
                                        </h2>
                                        <form className="mt-5" onSubmit={handleTweetUpload}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-base font-medium dark:text-white text-gray-900">
                                                        Your Text
                                                    </label>
                                                    <textarea placeholder="Pata Hai Ajj kya Huva ?" className="dark:bg-black bg-gray-100 w-full dark:text-white text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" name="content" required></textarea>

                                                </div>
                                                <div className='mt-2'>

                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <label className="text-base dark:text-white font-medium text-gray-900">
                                                            Tweet Picture
                                                        </label>
                                                    </div>
                                                    <div className="mt-2">
                                                        <input className="file-input w-full max-w-xs" type="file" name="tweetthumbnail" required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80" type="submit">
                                                        {tweetLoading ? <Spinner size="sm" /> : 'Upload Tweet'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        {tweetLoading && (
                                            <div className="mt-4">
                                                <Progress hasStripe isAnimated value={tweetProgress} />
                                                <p className="text-center mt-2">{tweetProgress}%</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {error && (
                <Alert className='bg-red-600 text-black' position={"top"} status="error" mt={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
        </>
    );
}

export default Upload;