import AWS from 'aws-sdk';


const s3 = new AWS.S3(); // Initialize the S3 client

// Function to delete all objects in a folder (prefix) in S3
const deleteFolderFromS3 = async (folderPrefix) => {
    const listParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: folderPrefix, // Folder or prefix to delete
    };

    try {
        // List all objects in the folder (prefix)
        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) {
            //console.log('No objects found to delete.');
            return;
        }

        // Prepare objects to be deleted
        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
                Objects: listedObjects.Contents.map(object => ({ Key: object.Key })),
            },
        };

        // Delete all objects in the folder (prefix)
        const deleteResult = await s3.deleteObjects(deleteParams).promise();
        //console.log('Delete result:', deleteResult);
        return deleteResult;
    } catch (error) {
        console.error('Error deleting folder from S3:', error);
        throw new Error('Failed to delete folder from S3');
    }
};

export default deleteFolderFromS3