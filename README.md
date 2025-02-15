---

# Vibe Social: Share Videos and Tweet's


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
# VIBESocial - Video & Post Sharing Platform

VIBESocial is a modern social media platform that allows users to share videos and posts. The platform includes features like video transcoding, multi-resolution support, and cloud storage integration.

## Prerequisites

Before starting the setup, ensure you have the following:

- Docker installed on your machine
- Node.js and npm installed
- Accounts/API keys for:
  - MongoDB Atlas
  - AWS S3
  - Cloudinary

## Quick Start with Pre-built Docker Image

If you want to skip building the transcoder service locally, you can use our pre-built Docker image:

```bash
docker pull bhanupratap21/vibesocial-videotranscoder
docker run --env-file ./transcoderBackend/.env -p 8000:8000 bhanupratap21/vibesocial-videotranscoder
```

## Full Local Setup

### 1. Fork and Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VIBESocial-Videos-Posts-Shareing-Platfrom-By-BPSS.git
cd VIBESocial-Videos-Posts-Shareing-Platfrom-By-BPSS
```

### 2. Environment Setup

#### Backend (.env)
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster0.vrxy93a.mongodb.net/
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ENCODER1=http://localhost:8000
ENCODER2=http://localhost:8001
```

#### Frontend (.env)
```env
VITE_URL=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_ISUPLOADON=true
```

#### Transcoder Backend (.env)
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
PORT=8000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN1=http://localhost:5173
CORS_ORIGIN2=additional_origin
CORS_ORIGIN3=additional_origin
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Starting the Services

#### Backend
```bash
cd Backend
npm install
npm run start
```

#### Frontend
```bash
cd Frontend
npm install
npm run dev
```

#### Transcoder Service

Option 1: Using Local Build
```bash
cd transcoderBackend
docker build -t vibesocialtranscoder .
docker run --env-file .env -p 8000:8000 vibesocialtranscoder
```

Option 2: Using Pre-built Image
```bash
docker pull bhanupratap21/vibesocial-videotranscoder
docker run --env-file ./transcoderBackend/.env -p 8000:8000 bhanupratap21/vibesocial-videotranscoder
```

### 4. Verify Setup

1. Backend should show: "MongoDB connected!! DB HOST: [hostname]"
2. Frontend should be accessible at: http://localhost:5173
3. Transcoder status should be available at: http://localhost:8000/status

## Video Processing Workflow

When a video is uploaded, the system:
1. Processes the video through multiple stages
2. Transcodes to multiple resolutions (240p, 460p, 720p)
3. Segments the video for streaming
4. Uploads to S3 storage
5. Updates the database with video information

The transcoder service logs each step of the process, including:
- Video processing stages
- Transcoding progress
- S3 upload status
- Segment generation
- Database updates

## Troubleshooting

If you encounter issues:
1. Check all environment variables are properly set
2. Ensure Docker is running
3. Verify all services are accessible on their respective ports
4. Check the transcoder logs for detailed error information

## Support

For additional help:
- Check StackOverflow discussions
- Use AI chatbots for technical assistance
- Contact: [bpss.tech](http://bpss.tech)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
---

With Vibe Social, you'll experience a blend of video sharing and social networking that keeps users engaged and entertained. Join the vibrant community and share your videos and tweets!

---
