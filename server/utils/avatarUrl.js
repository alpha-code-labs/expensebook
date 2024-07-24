import { config } from 'dotenv'

config();

// const avatars = AVATARS
export default function getRandomAvatarUrl() {
    const baseUrl = "https://blobstorage0401.blob.core.windows.net/avatars/";
    const randomNumber = Math.floor(Math.random() * (52 - 27 + 1)) + 27;
    const avatarUrl = `${baseUrl}IDR_PROFILE_AVATAR_${randomNumber}@1x.png`;
    return avatarUrl;
}


