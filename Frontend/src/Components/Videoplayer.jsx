import { useEffect, useRef } from 'react';

const VideoPlayer = ({ id, videopublicId, thumbnail, width, height, ...props }) => {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (!cloudinaryRef.current) {
      cloudinaryRef.current = window.cloudinary;
      playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
        cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        controls: true,
        showJumpControls: true,
        autoplay: false,
        pictureInPictureToggle: true,
        logoOnclickUrl: 'https://bhanu-pratap-portfolio.vercel.app/',
        logoImageUrl: 'https://i.pinimg.com/236x/01/4e/7c/014e7c41682d5e1f96bfd171b52988e9.jpg',
        fluid: true,
        colors: {
          accent: '#89C9FF'
        },
        secure: true,
      });
    }

    // Load the video based on publicId
    playerRef.current.source(videopublicId, {
      poster: thumbnail
    });

    return () => {
      // Cleanup
      playerRef.current.dispose();
    };
  }, [videopublicId]);

  return (
    <div className='-ml-4 w-[100vw]  z-51 -mt-4 sm:w-[50vw]' style={{ aspectRatio: `${width} / ${height}` }}>
      <video
        
        ref={videoRef}
        id={id}
        className="cld-video-player cld-fluid dark:rounded-xl"
        controls
        autoPlay
        data-cld-public-id={videopublicId}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
