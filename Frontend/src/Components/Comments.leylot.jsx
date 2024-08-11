import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useToast,
    Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Comment({ comment, filterondeletecomments, status, userdata }) {
    //console.log(comment)
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [likebyuserstate, setlikeuserstate] = useState(comment.commentLikeState || false);
    const [likecount, setlikecount] = useState(comment.likeCount || 0)
    const [commenterror, setcommentsError] = useState({
        status: false,
        msg: ""
    });
    const [commentText, setCommentText] = useState(comment.content);
    const [loadingeditcomment, setloadingeditcomment] = useState(false)

    const likecomment = async () => {
        try {
            //
            setlikecount(prevlikecount => likebyuserstate ? prevlikecount - 1 : prevlikecount + 1);
            setlikeuserstate(!likebyuserstate);
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/like/comment/${comment._id}`, { withCredentials: true });


        } catch (error) {
            //console.log(error)
            toast({
                title: error.response?.data?.errors || "Error While Like Comment Pls & Login Again",
                description: "pls Try Again.",
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        }
    }

    const deletecomment = async () => {
        setcommentsError({
            status: false,
            msg: ""
        });
        setloadingeditcomment(true);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/comment/deletecomment/${comment._id}`, { withCredentials: true });
            // console.log(response)
            filterondeletecomments(comment._id);
        } catch (error) {
            // console.log(error)
            setcommentsError({
                status: true,
                msg: "Error : Error While deleteing Comment Pls Try Again"
            });
        } finally {
            setloadingeditcomment(false)
        }
    }
    // it is for update post is a diff part
    const postComments = async () => {
        if (commentText.length === 0) {
            return setcommentsError({
                status: true,
                msg: "Bhai Kuch Toh Likhe Yr"
            })
        }
        setloadingeditcomment(true);
        setcommentsError({
            status: false,
            msg: ""
        })
        try {
            const response = await axios.patch(`${import.meta.env.VITE_URL}/api/v1/comment/updatecomment/${comment._id}`, { content: commentText }, { withCredentials: true })
            //console.log(response.data.data)
            comment.content = response.data.data.content
            onClose();
        } catch (error) {
            console.log(error)
            setcommentsError({
                status: true,
                msg: "Error : Error While Updateing Comment Pls Try Again"
            });
        } finally {
            setloadingeditcomment(false)
        }
    };

    return (
        <div key={comment._id} className="flex justify-center items-center mt-4 z-24 sm:min-w-72  gap-2 p-4">

            <Link to={`/user/userprofile/${comment.user.username}`} className="h-10 w-10 rounded-full">
                <img className='rounded-full w-10 h-10' src={comment.user.avatar.url} alt={`${comment.user.username}'s avatar`} />
            </Link>
            <Link to={`/user/userprofile/${comment.user.username}`} className=" h-14 flex-1">
                <div className="mb-1 rounded-lg text-md">
                    <h4>{comment.user.username}</h4>
                </div>
                <div className="z-30 max-h-14 overflow-y-auto  text-sm">
                    <p>{comment.content}</p>
                </div>
            </Link>

            <div onClick={likecomment} className='flex justify-evenly items-center w-12'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    height="24"
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                >
                    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                            d="M 45 10.715 c 4.77 -4.857 11.36 -7.861 18.64 -7.861 C 78.198 2.854 90 14.87 90 29.694 c 0 35.292 -36.812 34.15 -45 57.453 C 36.812 63.843 0 64.986 0 29.694 C 0 14.87 11.802 2.854 26.36 2.854 C 33.64 2.854 40.23 5.858 45 10.715 z"
                            style={{ fill: likebyuserstate ? 'rgb(211,28,28)' : "currentcolor" }}
                            transform="matrix(1 0 0 1 0 0)"
                        />
                    </g>
                </svg>
                {likecount}
            </div>
            <div>
                {userdata.username === comment.user.username ? (
                    <svg onClick={onOpen} className="fill-current stroke-current w-4 h-4 rounded-full" height="100" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100" width="100" x="0" xmlns="http://www.w3.org/2000/svg" y="0">
                        <path className="svg-stroke-primary" d="M50,17.4h0M50,50h0m0,32.6h0M50,22a4.7,4.7,0,1,1,4.7-4.6A4.7,4.7,0,0,1,50,22Zm0,32.7A4.7,4.7,0,1,1,54.7,50,4.7,4.7,0,0,1,50,54.7Zm0,32.6a4.7,4.7,0,1,1,4.7-4.7A4.7,4.7,0,0,1,50,87.3Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
                        </path>
                    </svg>
                ) : null}
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter='blur(0px)' />
                <ModalContent className='dark:bg-black bg-white dark:text-white text-black' >
                    <ModalHeader> </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Tabs isFitted variant='enclosed'>
                            <TabList mb='1em'>
                                <Tab>Edit Comment</Tab>
                                <Tab>Delete Comment</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <div className='flex flex-col justify-center items-center'>
                                        <div className="relative bottom-1 mb-2 mt-2">
                                            <form onSubmit={e => {
                                                e.preventDefault();
                                                postComments();
                                            }}>
                                                <input
                                                    type="text"
                                                    placeholder="Add Comment"
                                                    className="block w-96 rounded-2xl border dark:text-white  border-neutral-300 bg-transparent py-4 pl-6  text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    value={commentText}
                                                />
                                            </form>

                                            <div className="absolute inset-y-1 right-6 flex justify-end">
                                                {
                                                    loadingeditcomment ? (
                                                        <div className='flex justify-center items-center'>
                                                            <Spinner size="sm" />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                type="submit"
                                                                onClick={postComments}
                                                                aria-label="Submit"
                                                                className="flex aspect-square h-full items-center justify-center rounded-xl  dark:text-white transition "
                                                            >
                                                                <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                                                    <path
                                                                        fill="currentcolor"
                                                                        fill-rule="evenodd"
                                                                        clip-rule="evenodd"
                                                                        d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                                                    ></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {
                                            commenterror.status && <h3>{commenterror.msg}</h3>
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className='flex justify-center flex-col gap-4 items-center'>
                                        <h3>Delete Comment</h3>
                                        <button
                                            class="inline-flex w-82 items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
                                            onClick={deletecomment}
                                        >
                                            <svg
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                class="h-5 w-5 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    stroke-width="2"
                                                    stroke-linejoin="round"
                                                    stroke-linecap="round"
                                                ></path>
                                            </svg>
                                            {
                                                loadingeditcomment ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <h2>Delete</h2>
                                                )
                                            }

                                        </button>
                                        {
                                            commenterror.status && <h3>{commenterror.msg}</h3>
                                        }
                                    </div>

                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

function CommentsLayout({ filterondeletecomments, commentData }) {
    const { status, userdata } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);

    useEffect(() => {
        const seenIds = new Set();

        // Filter out duplicate comments based on _id
        const filteredData = commentData.filter(comment => {
            if (seenIds.has(comment._id)) {
                return false;
            } else {
                seenIds.add(comment._id);
                return true;
            }
        });
        setData(filteredData);
        // console.log('Updated data:', commentData);
    }, [commentData]);


    return (
        <div>
            {data.map((comment) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    status={status}
                    filterondeletecomments={filterondeletecomments}
                    userdata={userdata}
                />
            ))}
        </div>
    );
}

export default CommentsLayout;