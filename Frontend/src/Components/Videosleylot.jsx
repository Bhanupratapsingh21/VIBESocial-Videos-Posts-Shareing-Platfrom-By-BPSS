import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    ModalBody,
    useToast,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function IndiVideo({ video, status, userdata }) {
    const [userplaylists, setuserplaylists] = useState([]);
    const toast = useToast();
    const [currrentplaylist, setcurrentplaylist] = useState('');
    const [addordelete, setaddordelete] = useState(true); // true for add or false for delete 
    const addvideotoplaylist = async () => {
        // console.log(currrentplaylist);
        if (currrentplaylist === "default") {
            return toast({
                title: "Pls Select The Playlist Your Want To Add",
                description: "Hey Have You Seen The Select List?",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 2000
            })
        }
        const value = currrentplaylist.split("/")
        if (value[0] === "already") {
            const value = currrentplaylist.split("/")
            try {
                const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/playlist/removefromplaylist/${value[1]}/${video._id}`, {}, { withCredentials: true });
                //console.log(response.data);
                onClose();
                toast({
                    title: "Video Deleted From Playlist",
                    description: "Your Video Is Deleted From Playlist Successfully",
                    status: "success",
                    position: "top",
                    isClosable: true,
                    duration: 3000
                })
            } catch (error) {
                onClose();
                console.log(error);
                toast({
                    title: "Error While Deleteing Video from Playlist",
                    description: "Pls Try Again ",
                    status: "error",
                    position: "top",
                    isClosable: true,
                    duration: 2000
                })
            }
        } else {
            try {
                const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/playlist/addtoplaylist/${currrentplaylist}/${video._id}`, {}, { withCredentials: true });
                // console.log(response.data);
                onClose();
                toast({
                    title: "Video Added To Playlist",
                    description: "Your Video Is Added To Playlist Successfully",
                    status: "success",
                    position: "top",
                    isClosable: true,
                    duration: 3000
                })
            } catch (error) {
                onClose();
                console.log(error);
                toast({
                    title: "Error While Added Video In Playlist",
                    description: "Pls Try Again ",
                    status: "error",
                    position: "top",
                    isClosable: true,
                    duration: 2000
                })
            }

        }

    };



    const getuserplaylsit = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/playlist/getuserplaylist/${userdata._id}`)
            setuserplaylists(response.data.data)
        } catch (error) {
            onClose();
            toast({
                title: "Pls Create Playlist First",
                description: "You Can Create Playlist From Playlist Section",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 2000
            })
        }
    }

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handlenavigation = (videoid) => {
        navigate(`/video/${videoid}`);
    };


    const openmodel = () => {
        if (status) {
            getuserplaylsit();
            onOpen();
        } else {
            toast({
                title: "pls login or signup",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 2000
            })
        }

    }

    return (
        <>
            <div key={video._id}>
                <div className="flex justify-between shadow-md flex-col dark:bg-black sm:w-[320px] w-[100vw] -ml-4 sm:ml-0 pb-3 sm:rounded-xl">
                    <div onClick={() => handlenavigation(video._id)}>
                        <img
                            className="shadow-md sm:rounded-xl sm:w-max w-[100vw] h-max sm:h-48"
                            src={video.thumbnail}
                            onError={(e) => e.target.src = 'http://res.cloudinary.com/dhvkjanwa/image/upload/v1720186851/zrirfteydyrh79xaua3q.jpg'}
                            alt="Video Thumbnail"
                        />
                    </div>
                    <div className="flex justify-between items-center pt-2 px-2 h-15 space-x-2">
                        <Link className=' flex justify-left items-center' to={`/user/userprofile/${video.ownerusername}`}>
                            <div className="flex w-13 mr-2">
                                <img className="h-8 w-8 rounded-full" src={video.owneravatar} alt="img" />
                            </div>
                            <div className="space-y-1  flex flex-col justify-center max-w-[235px]">
                                <div className="dark:text-white text-sm sm:text-base text-black overflow-hidden max-h-[45px] -mb-2 sm:-mb-0">{video.tittle}</div>
                                <div className="flex dark:text-gray-400  justify-left text-sm sm:text-base items-center">
                                    <span className="max-w-[115px] max-h-[25px]  overflow-hidden">{video.ownerusername}</span>
                                    <span className='px-2'> • </span>
                                    <span className="max-h-[25px]">{video.views} views</span>
                                </div>
                            </div>
                        </Link>
                        <svg onClick={openmodel} className="fill-current stroke-current w-5 h-5 rounded-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100" width="100" x="0" xmlns="http://www.w3.org/2000/svg" y="0">
                            <path className="svg-stroke-primary" d="M50,17.4h0M50,50h0m0,32.6h0M50,22a4.7,4.7,0,1,1,4.7-4.6A4.7,4.7,0,0,1,50,22Zm0,32.7A4.7,4.7,0,1,1,54.7,50,4.7,4.7,0,0,1,50,54.7Zm0,32.6a4.7,4.7,0,1,1,4.7-4.7A4.7,4.7,0,0,1,50,87.3Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent className="dark:bg-black bg-white dark:text-white text-black">
                    <ModalHeader ><h2 className="dark:bg-black bg-white dark:text-white text-black">Add Video To Playlist</h2></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='flex flex-col justify-left items-left'>
                            <label class="text-sm mb-2 dark:text-white text-gray-900 cursor-pointer" for="gender">
                                Select Playlist
                            </label>
                            <select
                                class=" dark:text-white  dark:bg-black bg-white text-black  border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                                onChange={(e) => {
                                    const valuearr = e.target.value.split("/")
                                    if (valuearr[0] === "already") {
                                        setaddordelete(false)
                                    } else {
                                        setaddordelete(true)
                                    }
                                    setcurrentplaylist(e.target.value)

                                }} defaultValue={"default"} name="" id="">
                                <option key={"default"} value={"default"} >Select Your Playlist</option>
                                {
                                    userplaylists.length >= 0 ? (

                                        userplaylists.map((playlist) => (
                                            playlist.videos.includes(video._id) ?
                                                (
                                                    <option key={playlist._id} value={`already/${playlist._id}`} >{playlist?.name}(Alredy Exist In)</option>
                                                ) : (
                                                    <option key={playlist._id} value={playlist._id} >{playlist?.name}</option>
                                                )

                                        ))
                                    ) : (
                                        <option value="loading">Loading...</option>
                                    )
                                }

                            </select>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={addvideotoplaylist}>
                            {addordelete ? "Add" : "Delete"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

function VideosLeyout({ videodata }) {

    const { status, userdata } = useSelector((state) => state.auth);

    return (
        <>
            <div className="grid px-0 py-1 sm:pl-0 w-max sm:gap-4 justify-center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {videodata.map((video) => (
                    <IndiVideo status={status} userdata={userdata} key={video._id} video={video} />
                ))}
            </div>
        </>
    );
}

export default VideosLeyout;