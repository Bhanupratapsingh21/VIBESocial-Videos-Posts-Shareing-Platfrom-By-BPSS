---

# Vibe Social: Share Videos and Tweets

Vibe Social is an innovative and dynamic platform that blends the best of video sharing and social networking. It allows users to share and discover videos and tweets within a vibrant community. Built using a modern tech stack, Vibe Social provides a seamless user experience with rich features designed to engage and entertain.

## Features

- **User Authentication**: Easily sign up or log in to explore the platform.
- **Content Discovery**: Share and discover a variety of videos and tweets.
- **Subscriptions & Playlists**: Subscribe to channels and create/manage your own playlists.
- **Interactive Features**: Like, comment, and share posts with others.
- **Content Management**: Edit, delete, or change thumbnails for your videos. You can also manage your watch history, subscriptions, and channel status.
- **Advanced Search**: Discover tailored content based on tags and interests.
- **Channel & Video Management**: Privately upload videos, edit posts, and stay updated on channel status.
- **Future Enhancements**: A built-in transcoder is planned to improve video streaming quality.

## Tech Stack

- **Frontend**: React.js, Chakra UI, React Router, React DOM, Redux for global state
- **Backend**: Node.js, Express.js, JWT for authentication, Bcrypt for security, Mongoose for MongoDB interaction
- **Database**: MongoDB with Mongoose aggregation pipelines for efficient data handling
- **Media**: Cloudinary for media storage and video streaming (via Cloudinary CDN)
- **File Handling**: Multer for file uploads
- **API**: Axios for API requests, CORS for secure cross-origin resource sharing
- **Environment Management**: dotenv for managing environment variables

## Key Highlights

✅ **Rich User Features**: Includes subscribing to channels, liking, commenting, sharing posts, creating/managing playlists, and advanced search for personalized content.  
✅ **Unified Platform**: Combines video sharing and social networking, allowing users to engage with both videos and tweets.  
✅ **Content Management**: Full control over personal videos and posts—edit, delete, change thumbnails, and track channel status.  
✅ **Scalability**: Built to scale with a growing user base, ensuring smooth performance as the platform evolves.  
✅ **Future-Ready**: Upcoming features include a built-in transcoder to enhance video streaming quality.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibe-social.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vibe-social
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root and add the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_NAME=your_cloudinary_name
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Future Enhancements

- **Inbuilt Transcoder**: To optimize video streaming and offer a smoother user experience.
- **New Features**: Expanded social interactions, enhanced content filtering, and additional media tools for users.

---

With Vibe Social, you'll experience a blend of video sharing and social networking that keeps users engaged and entertained. Join the vibrant community and share your videos and tweets!

---
