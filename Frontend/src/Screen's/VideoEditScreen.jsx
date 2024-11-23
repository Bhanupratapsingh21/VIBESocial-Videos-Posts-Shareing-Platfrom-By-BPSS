import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState ,useRef} from 'react';
import { useSelector } from 'react-redux';
import M3u8Videoplayer from "../Components/M3u8Videoplayer";
import videojs from "video.js";
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
    const [iscloudinary, setiscloudinary] = useState(false);
    const [m3u8url, setm3u8url] = useState("");
    const [resolution, setresolution] = useState("720p")
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
                videoData.video.videoFile.cloudinaryUrl = extractIdFromUrl(videoData?.video.videoFile.cloudinaryUrl);
                setIsChecked(videoData?.video.isPublished)
                setm3u8url(videoData.video.videoFile.encodedUrl)
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

    // m3u8 pleyer confs
    const playerRef = useRef(null);

    const videoPlayerOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: m3u8url[resolution.toString()],
                type: "application/x-mpegURL"
            }
        ]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
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
                            {iscloudinary ?
                                <VideoPlayer videopublicId={video.video.videoFile.cloudinaryUrl} thumbnail={video.video.thumbnail} />
                                :
                                <M3u8Videoplayer options={videoPlayerOptions} onReady={handlePlayerReady} />
                            }
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
                            <div className="flex justify-center items-center w-full py-2 gap-2  rounded-lg">

                                <button
                                    onClick={() => setiscloudinary(false)}
                                    href="#"
                                    className={`flex w-full overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2  whitespace-pre md:flex group relative  justify-center gap-2 rounded-md transition-all duration-300 ease-out ${!iscloudinary ? "ring-2 ring-black ring-offset-2" : ""} `}
                                >
                                    <div className="flex items-center">

                                        <span className="ml-1 text-white">AWS M3U8 Server</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setiscloudinary(true)}
                                    href="#"
                                    className={`flex w-full overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2  whitespace-pre md:flex group relative  justify-center gap-2 rounded-md transition-all duration-300 ease-out ${iscloudinary ? "ring-2 ring-black ring-offset-2" : ""} `}
                                >
                                    <div className="flex items-center">

                                        <span className="ml-1 text-white">Cloudinary Server</span>
                                    </div>
                                </button>

                            </div>
                            {
                                !iscloudinary && <div className="flex justify-center items-center w-full  gap-2  rounded-lg">
                                    <button
                                        onClick={() => setresolution("240p")}
                                        className={`cursor-pointer w-full  ${resolution === "240p" ? "ring-2 ring-black ring-offset-2" : ""} bg-gray-800 relative inline-flex items-center justify-center gap-2  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  h-9 rounded-md px-3`}
                                    >

                                        240P
                                    </button>
                                    <button
                                        onClick={() => setresolution("460p")}
                                        className={`cursor-pointer w-full  ${resolution === "460p" ? "ring-2 ring-black ring-offset-2" : ""} bg-gray-800 relative inline-flex items-center justify-center gap-2  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  h-9 rounded-md px-3`}
                                    >

                                        420P
                                    </button>
                                    <button
                                        onClick={() => setresolution("720p")}
                                        className={`cursor-pointer w-full  ${resolution === "720p" ? "ring-2 ring-black ring-offset-2" : ""} bg-gray-800 relative inline-flex items-center justify-center gap-2  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  h-9 rounded-md px-3`}
                                    >
                                        720P
                                    </button>

                                </div>
                            }

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