import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, } from "react-redux";
import axios from "axios";
import {
    useToast,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    useBreakpointValue,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    position,
} from "@chakra-ui/react";
import CommentsLayout from "./Comments.leylot";
import LoadingComment from "./Commentsloader";
import { Link } from "react-router-dom";
function Tweet({ tweet, filterondelete, userdata, status, toast }) {
    const date = tweet.createdAt.slice(0, 10);
    //

    // for comments 
    const [comments, setComments] = useState([]);
    const [commentsloading, setcommentsLoading] = useState(true);
    const [commentserror, setcommentsError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const observer = useRef();
    const lastCommentElementRef = useRef();
    const [viewcomment, setviewcomments] = useState(false)
    const [commenttext, setcommenttext] = useState("")

    const [commentpostloading, setcommentpostloading] = useState(false);
    const fetchComments = async (page) => {
        try {
            setcommentsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/comment/getcomments/${tweet._id}?limit=10&page=${page}`, { withCredentials: true });
            const commentsData = response.data.data.Comments;
            //console.log(commentsData)
            //setComments(prevComments => [...prevComments, ...commentsData]);
            setComments(prevComments => {
                const posts = [...prevComments, ...commentsData];
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
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error(error);
            setcommentsError(true);
        } finally {
            setcommentsLoading(false);
        }
    };


    const filterondeletecomments = (_id) => {
        const newdata = comments.filter(post => post._id !== _id)
        setComments(newdata);
    }

    const postcomments = async () => {
        setcommentsLoading(false);
        setcommentpostloading(true)
        setcommentsError(false);
        try {


            setcommenttext("");
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/comment/postcomment/Tweet/${tweet._id}`, { content: commenttext }, { withCredentials: true });

            //console.log(response.data.data);
            const comment = {
                content: response.data.data.content,
                _id: response.data.data._id,
                user: {
                    ...userdata
                }
            }
            setComments([...comments, comment])// console.log(comments);
        } catch (error) {
            console.log(error)
            setcommentsError(true);
        } finally {
            setcommentpostloading(false)
            setcommentsLoading(false);
        }
    }

    useEffect(() => {
        if (viewcomment) {
            fetchComments();

        }
    }, [page, viewcomment]);

    useEffect(() => {
        if (commentsloading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (lastCommentElementRef.current) {
            observer.current.observe(lastCommentElementRef.current);
        }
        return () => {
            if (observer.current) observer.current.disconnect();
        }
    }, [commentsloading, page, totalPages]);
    //





    const [subscribe, setSubscribe] = useState(tweet.subscribedByCurrentUser);
    const [likeCount, setLikeCount] = useState(tweet.likeCount);
    const [likeState, setLikeState] = useState(tweet.likedByCurrentUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const placement = useBreakpointValue({ base: 'bottom', md: 'right' });
    const { isOpen: ChangesModelIsOpen, onOpen: ChangesModelonOpen, onClose: ChangesModelonClose } = useDisclosure()

    //edit post tweet 
    const [editposttext, seteditposttext] = useState(tweet.content)
    const [editpostloading, seteditpostloading] = useState(false)
    const [editposterror, seteditpostserror] = useState({
        status: false,
        msg: ""
    });

    const deletepost = async () => {
        seteditpostserror({
            status: false,
            msg: ""
        });
        seteditpostloading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/tweets/deleteblog/${tweet._id}`, {}, { withCredentials: true });
            // console.log(response)
            filterondelete(tweet._id);
            ChangesModelonClose();
        } catch (error) {
            console.log(error)
            seteditpostserror({
                status: true,
                msg: "Error : Error While deleteing Comment Pls Try Again"
            });
        } finally {
            seteditpostloading(false)
        }
    }
    // it is for update post is a diff part
    const posteditpost = async () => {
        if (editposttext.length === 0) {
            return seteditpostserror({
                status: true,
                msg: "Bhai Kuch Toh Likhe Yr"
            })
        }
        seteditpostloading(true);
        seteditpostserror({
            status: false,
            msg: ""
        })
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/tweets/editblogs/${tweet._id}`, { content: editposttext }, { withCredentials: true })
            console.log(response.data.data)
            tweet.content = response.data.data.content
            ChangesModelonClose();
        } catch (error) {
            console.log(error)
            seteditpostserror({
                status: true,
                msg: "Error : Error While Updateing Comment Pls Try Again"
            });
        } finally {
            seteditpostloading(false)
        }
    };

    const opencommentsections = () => {
        if (status) {

            onOpen();
            setviewcomments(true);
        } else {
            toast({
                title: "Error",
                description: "Please login Or Signup To Enjoy Comments",
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        }
    }

    const toggleSubscribe = async () => {
        if (status) {
            try {
                setSubscribe((prevSubscribe) => !prevSubscribe);
                await axios.post(
                    `${import.meta.env.VITE_URL}/api/v1/subscriptions/addSubscriptions/${tweet.createdBy._id}`,
                    {},
                    { withCredentials: true }
                );
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error while Subscribe. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Error",
                description: "Please log in To Subscribe.",
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        }
    };

    const toggleLike = useCallback(async () => {
        if (status) {
            try {
                setLikeCount((prevLikeCount) => (likeState ? prevLikeCount - 1 : prevLikeCount + 1));
                setLikeState((prevLikeState) => !prevLikeState);
                const response = await axios.get(
                    `${import.meta.env.VITE_URL}/api/v1/like/tweet/${tweet._id}`,
                    { withCredentials: true }
                );
                //console.log(response)
            } catch (error) {
                //console.log(error)
                toast({
                    title: "Error",
                    description: "Error while liking the Post. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Error",
                description: "Please log in before liking the Post.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [status, tweet._id, likeState, toast]);

    return (
        <>
            <div key={tweet._id} className="dark:bg-black sm:rounded-md bg-white">
                <div className="bg-white dark:bg-black w-[100vw] sm:w-96 -mt-0 border-y-gray-600">
                    <div className="flex items-center px-2 pl-6 py-3">
                        <Link to={`/user/userprofile/${tweet.createdBy.username}`} className='flex justify-center items-center'>
                            <img className="h-8 w-8 rounded-full" src={tweet.createdBy.profileimg} alt="Profile" />
                            <div className="ml-3">
                                <span className="text-sm font-semibold antialiased block leading-tight">{tweet.createdBy.username}</span>
                                <span className="text-gray-600 dark:text-gray-400 text-xs block">On {date}</span>
                            </div>
                        </Link>
                        <div className="flex justify-end items-center w-[70vw]">

                            {
                                tweet.createdBy._id !== userdata?._id ? (
                                    <button
                                        onClick={toggleSubscribe}
                                        className={`${subscribe ? 'bg-[#292929]' : 'bg-red-600'
                                            } border-2 dark:border-[#3e3e3e] rounded-lg text-white px-2 py-1 text-sm hover:border-[#fff] cursor-pointer transition`}
                                    >
                                        {subscribe ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                ) : null
                            }
                            {
                                tweet.createdBy._id === userdata?._id && (
                                    <svg onClick={ChangesModelonOpen} className="fill-current stroke-current w-5 h-5 ml-3 rounded-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100" width="100" x="0" xmlns="http://www.w3.org/2000/svg" y="0">
                                        <path className="svg-stroke-primary" d="M50,17.4h0M50,50h0m0,32.6h0M50,22a4.7,4.7,0,1,1,4.7-4.6A4.7,4.7,0,0,1,50,22Zm0,32.7A4.7,4.7,0,1,1,54.7,50,4.7,4.7,0,0,1,50,54.7Zm0,32.6a4.7,4.7,0,1,1,4.7-4.7A4.7,4.7,0,0,1,50,87.3Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
                                        </path>
                                    </svg>
                                )
                            }
                        </div>
                    </div>
                    <div className="border-t border-b border-y-gray-600  flex flex-col justify-center items-center max-w-[100vw]">
                        <img onDoubleClick={toggleLike} className="aspect-w-16 center object-cover " src={tweet.coverImageURL.url} alt="Tweet" />
                    </div>
                    <div className="flex items-center gap-5 mx-4 mt-3 mb-2">
                        <div className="flex justify-center items-center">
                            <button onClick={toggleLike}>
                                {likeState ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 256 256">
                                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                            <path
                                                d="M 45 10.715 c 4.77 -4.857 11.36 -7.861 18.64 -7.861 C 78.198 2.854 90 14.87 90 29.694 c 0 35.292 -36.812 34.15 -45 57.453 C 36.812 63.843 0 64.986 0 29.694 C 0 14.87 11.802 2.854 26.36 2.854 C 33.64 2.854 40.23 5.858 45 10.715 z"
                                                style={{ fill: 'rgb(211,28,28)' }}
                                                transform="matrix(1 0 0 1 0 0)"
                                            />
                                        </g>
                                    </svg>
                                ) : (
                                    <svg fill="#262626" className="dark:fill-white" height="24" viewBox="0 0 48 48" width="24">
                                        <path
                                            fill="red-600"
                                            d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                                        ></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <svg onClick={opencommentsections} fill="#262626" className="dark:fill-white" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path></svg>
                    </div>
                    <div className="font-semibold ml-4 text-sm">{likeCount} likes</div>
                    <div className="font-semibold text-sm h-10 overflow-hidden mx-4 mt-2 mb-4">
                        <p className="w-68">{tweet.content}</p>
                    </div>
                </div>
            </div>
            <Drawer
                isOpen={isOpen}
                placement={placement}
                onClose={onClose}
                size='sm'
            >
                <DrawerOverlay />
                <DrawerContent className="rounded-t-3xl">
                    <DrawerCloseButton />
                    <DrawerHeader>Comments</DrawerHeader>

                    <DrawerBody >
                        <div className="sm:h-max max-h-[360px] flex flex-col items-left justify-center overflow-y-scroll">
                            <CommentsLayout filterondeletecomments={filterondeletecomments} commentData={comments} />
                            {commentsloading && <LoadingComment totalNo={9} />}
                            <div ref={lastCommentElementRef} />
                            {commentserror && <div className="flex justify-center text-center mb-4 items-center">This Video Don't Have Any Comments</div>}
                        </div>
                    </DrawerBody>

                    <DrawerFooter>
                        <div class="relative flex left-2  flex-col items-center justify-center mb-2  -mt-4">
                            <form onSubmit={e => {
                                e.preventDefault();
                                postcomments();
                            }}>
                                <input
                                    type="text"
                                    placeholder="Add Comment"
                                    class=" sm:-ml-32 w-[90vw] sm:w-[30vw] pl-4 flex flex-col items-center justify-center  rounded-2xl border dark:text-white  border-neutral-300 bg-transparent py-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                                    onChange={(e) => setcommenttext(e.target.value)}
                                    value={commenttext}
                                />
                            </form>
                            <div class="absolute inset-y-1 right-4 flex justify-end">
                                <button
                                    type="submit"
                                    onClick={postcomments}
                                    aria-label="Submit"
                                    class="flex aspect-square h-full items-center justify-center rounded-xl dark:bg-neutral-950 dark:text-white transition"
                                >
                                    {
                                        commentpostloading ? (
                                            <Spinner size={"sm"} />
                                        ) : (
                                            <svg viewBox="0 0 16 6" aria-hidden="true" class="w-4">
                                                <path
                                                    fill="currentColor"
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                                ></path>
                                            </svg>
                                        )
                                    }
                                </button>
                            </div>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Modal isOpen={ChangesModelIsOpen} onClose={ChangesModelonClose}>
                <ModalOverlay />
                <ModalContent className="dark:bg-black bg-white dark:text-white text-black">
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs isFitted variant='enclosed'>
                            <TabList mb='1em'>
                                <Tab>Edit Post</Tab>
                                <Tab>Delete Post</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <div className='flex flex-col justify-center items-center'>
                                        <div className="relative bottom-1 mb-2 mt-2">
                                            <form onSubmit={e=>{
                                                e.preventDefault();
                                                posteditpost();
                                            }}>
                                                <input
                                                    type="text"
                                                    placeholder="Add Comment"
                                                    className="block w-96 rounded-2xl border dark:text-white  border-neutral-300 bg-transparent py-4 pl-6  text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
                                                    onChange={(e) => seteditposttext(e.target.value)}
                                                    value={editposttext}
                                                />
                                            </form>
                                            <div className="absolute inset-y-1 right-6 flex justify-end">
                                                {
                                                    editpostloading ? (
                                                        <div className='flex justify-center items-center'>
                                                            <Spinner size="sm" />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                type="submit"
                                                                onClick={posteditpost}
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
                                            editposterror.status && <h3>{editposterror?.msg || "Error pls try again leter"}</h3>
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className='flex justify-center flex-col gap-4 items-center'>
                                        <h3>Delete Comment</h3>
                                        <button
                                            class="inline-flex w-82 items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
                                            onClick={deletepost}
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
                                                editpostloading ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <h2>Delete</h2>
                                                )
                                            }

                                        </button>
                                        {
                                            editposterror.status && <h3>{editposterror.msg || "Error : Pls try again"}</h3>
                                        }
                                    </div>

                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

function TweetsLayout({ filterondelete, tweetsdata }) {
    const { status, userdata } = useSelector((state) => state.auth);
    const toast = useToast();

    return (
        <div className="flex flex-col px-0 py-1 -mt-5 sm:pl-0 sm:gap-4 items-center justify-center">
            {tweetsdata?.map((tweet) => {
                //console.log(tweet);
                return (
                    <Tweet key={tweet._id} filterondelete={filterondelete} tweet={tweet} userdata={userdata} status={status} toast={toast} />
                )
            }
            )}
        </div>
    );
}

export default TweetsLayout;
