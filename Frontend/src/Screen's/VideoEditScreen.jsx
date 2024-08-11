import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import VideoPlayer from '../Components/Videoplayer';
import {
    Accordion,
    AccordionItem,
    Box,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Progress,
    useToast
} from '@chakra-ui/react';
import Headertwo from '../Components/Header2';

function Editvideo() {
    const { videoid } = useParams();
    const [video, setVideo] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [progress, setProgress] = useState(0);
    const { status, userdata } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const toast = useToast();
    const [isChecked, setIsChecked] = useState(false);

    const getVideo = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/videos/getvideo/${videoid}`, { withCredentials: true });
            const videoData = response.data.data;
            if (videoData.video.owner !== userdata._id) {
                navigate(`/video/${videoData.video._id}`);
            } else {
                videoData.video.videoFile = extractIdFromUrl(videoData?.video.videoFile);
                setIsChecked(videoData?.video.isPublished)

                setVideo(videoData);
                // console.log(video)
            }
        } catch (error) {
            setError(error.response?.data?.errors || 'An unexpected error occurred.');
            toast({
                title: error.response?.data?.errors || "An unexpected error occurred.",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const extractIdFromUrl = (url) => {
        const regex = /\/(?:v\d+\/)?([^\/]+)\.[a-zA-Z0-9]+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    useEffect(() => {
        getVideo();
    }, [videoid, status]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);

        const formData = new FormData();
        formData.append('tittle', event.target.tittle.value);
        formData.append('description', event.target.description.value);
        formData.append('tegs', event.target.tegs.value);
        formData.append('thumbnail', event.target.thumbnail.files[0]);

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_URL}/api/v1/videos/update/videodetails/${videoid}`,
                formData,
                {
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        setProgress(Math.round((loaded * 100) / total));
                    }
                }
            );
            toast({
                title: "Video updated successfully.",
                status: "success",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
            navigate(`/video/${response.data.data._id}`);
        } catch (error) {
            setUpdateError(error.response?.data?.msg || 'An unexpected error occurred.');
            toast({
                title: error.response?.data?.msg || "An unexpected error occurred.",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    // for toggle 



    const handleToggle = async () => {
        setIsChecked(!isChecked);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds for less api calls
        callApi();
    };

    const callApi = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/videos/updateisPublished/${videoid}`, {
                withCredentials: true
            });
            // console.log(response)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Headertwo />
            <div className='dark:text-white mb-10 text-black'>
                {loading && (
                    <div className="flex justify-center text-lg items-center">
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
                )}
                {error && <div className="flex justify-center text-lg items-center">Error: {error}</div>}
                {!loading && !error && video && (
                    <>
                        <div>
                            <VideoPlayer videopublicId={video.video.videoFile} thumbnail={video.video.thumbnail} />
                            <div className="flex cursor-pointer mt-2 mb-2 items-center justify-between p-1 text-slate-400">
                                <label htmlFor="video-published">Video Published (Is Published?)</label>
                                <div className="relative inline-block">
                                    <input
                                        id="video-published"
                                        type="checkbox"
                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gray-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                        checked={isChecked}
                                        onChange={handleToggle}
                                    />
                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300"></span>
                                </div>
                            </div>
                            <Accordion className='border-t-white border-b-white  dark:border-t-black dark:border-b-black ' allowToggle={true}>
                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <button className="cursor-pointer group relative mt-1 -ml-2 w-[95vw] flex px-8 justify-center items-center py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md">
                                                <AccordionIcon />
                                                Show Current Thumbnail
                                            </button>
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <img className='aspect-w-16' src={video.video.thumbnail} alt="" />
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                            <div className="mt-4 sm:-ml-4 flex flex-col bg-gray-900 rounded-lg p-4 shadow-sm">
                                <h2 className="text-white font-bold text-lg">Edit Video Details</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mt-4">
                                        <label className="text-white" htmlFor="tittle">Title</label>
                                        <input
                                            placeholder="Your title"
                                            className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                                            name="tittle"
                                            type="text"
                                            defaultValue={video.video.tittle}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-white" htmlFor="description">Description</label>
                                        <textarea
                                            placeholder="Description"
                                            name='description'
                                            className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                                            id="description"
                                            defaultValue={video.video.description}
                                        ></textarea>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-white" htmlFor="tegs">Tags (please put a comma after every tag)</label>
                                        <input
                                            placeholder="Tags"
                                            className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                                            id="tegs"
                                            name="tegs"
                                            type="text"
                                            defaultValue={video.video.tegs}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-white" htmlFor="thumbnail">Thumbnail</label>
                                        <input
                                            className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="file"
                                        />
                                    </div>
                                    {updateError && <div className="text-red-500 mt-2">{updateError}</div>}
                                    {progress > 0 && (
                                        <Box width="100%" mt={4}>
                                            <Progress value={progress} size="sm" colorScheme="green" />
                                        </Box>
                                    )}
                                    <div className="mt-4 flex justify-end">
                                        <button className="bg-white text-black rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200" type="submit" disabled={updateLoading}>
                                            {updateLoading ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Editvideo;