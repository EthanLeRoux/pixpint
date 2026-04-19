import PixivAppApi from 'pixiv-app-api';

const pixiv = new PixivAppApi(
  import.meta.env.PIXIV_USERNAME || import.meta.env.VITE_PIXIV_USERNAME,
  import.meta.env.PIXIV_PASSWORD || import.meta.env.VITE_PIXIV_PASSWORD
);

export const login = async () => {
  try {
    await pixiv.login();
  } catch (error) {
    console.error('Pixiv login failed:', error);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const userData = await pixiv.userDetail(userId);
    return {
      name: userData.user.name,
      profileImage: userData.user.profile_image_urls.px_170x170,
      pixivUrl: `https://www.pixiv.net/users/${userId}`
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};