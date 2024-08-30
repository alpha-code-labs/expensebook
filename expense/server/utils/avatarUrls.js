import dotenv from "dotenv";

dotenv.config()

export default function getRandomAvatarUrl() {
    const baseUrl = process.env.AVATAR_URL;
    console.log("baseUrl .................", baseUrl)
    const randomNumber = Math.floor(Math.random() * (52 - 27 + 1)) + 27;
    const avatarUrl = `${baseUrl}IDR_PROFILE_AVATAR_${randomNumber}@1x.png`;
    return avatarUrl;
}


