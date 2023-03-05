// Import required libraries
import moment from 'moment';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Define function to upload image and caption to Instagram
async function uploadToInstagram(image, caption, token) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('caption', caption);
  const response = await fetch('https://api.instagram.com/v1/media/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (data.meta.code !== 200) {
    console.error(`Failed to upload to Instagram: ${data.meta.error_message}`);
    return null;
  }
  return data.data.media_id;
}

// Define function to schedule post on Facebook
async function scheduleOnFacebook(caption, image, time, token) {
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('source', image);
  formData.append('published', 'false');
  formData.append('scheduled_publish_time', time);
  const response = await fetch('https://graph.facebook.com/v12.0/me/photos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EAADT0wOgpFsBAMW0Md3lBmZB2eOQzp8CGajeZBY3Mv7rxmyJ8uHzZC7usaLEIzkZBZCpbgT6wbEoFPcPLJWA5XnrAZB6XVKPZCauJL5SQP0BmpOgqICN838h6DzQ9yqsSLVFTApiZCvVRvcUb6u1PczuDIaJZAGRfhNBjiuQaDDHB7DODUxpb6HQzbdXZADXwHGF9xZADhnOQZAqUhbdYWkvZB5pz}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (data.error) {
    console.error(`Failed to schedule on Facebook: ${data.error.message}`);
    return null;
  }
  return data.id;
}

// Define function to handle form submissions
async function handleSubmit(event) {
  event.preventDefault();
  
  const caption = document.getElementById('caption').value;
  const image = document.getElementById('image').files[0];
  const time = moment(document.getElementById('time').value).unix();
  
  // Get access tokens from Instagram and Facebook
  const instagramToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
  const facebookToken = 'YOUR_FACEBOOK_ACCESS_TOKEN';

  // Upload image and caption to Instagram
  const mediaId = await uploadToInstagram(image, caption, instagramToken);
  
  // Schedule post on Facebook
  const postId = await scheduleOnFacebook(caption, image, time, facebookToken);
  
  // Display success message
  alert(`Post scheduled on Instagram with media ID ${mediaId} and on Facebook with post ID ${postId}.`);
}

// Add event listener to form submit button
const postForm = document.getElementById('postForm');
function submitted(){
    handleSubmit()
}

postForm.addEventListener('submit', handleSubmit);
