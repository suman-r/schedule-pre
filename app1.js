// Import required libraries
const moment = require('moment');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Define function to upload image and caption to Instagram
async function uploadToInstagram(image, caption, time, token) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('caption', caption);
  formData.append('publish_at', moment(time).toISOString());
  const response = await fetch('https://graph.facebook.com/v12.0/17841446397729170/media', {
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
      'Authorization': `Bearer ${token}`,
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
  
  const images = document.querySelectorAll('.image-input');
  const captions = document.querySelectorAll('.caption-input');
  const times = document.querySelectorAll('.time-input');

  // Get access tokens from Instagram and Facebook
  const instagramToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
  const facebookToken = 'YOUR_FACEBOOK_ACCESS_TOKEN';

  // Loop through the images and schedule posts
  for (let i = 0; i < images.length; i++) {
    const caption = captions[i].value;
    const image = images[i].files[0];
    const time = moment(times[i].value).unix();

    // Upload image and caption to Instagram
    const mediaId = await uploadToInstagram(image, caption,time, instagramToken);
  
    // Schedule post on Facebook
    const postId = await scheduleOnFacebook(caption, image, time, facebookToken);
  
    // Display success message
    alert(`Post ${i+1} scheduled on Instagram with media ID ${mediaId} and on Facebook with post ID ${postId}.`);
  }
}

// Add event listener to form submit button
const postForm = document.getElementById('postForm');
postForm.addEventListener('submit', handleSubmit);

// Define function to add more image inputs
function addImageInput() {
  const container = document.getElementById('imageInputs');
  const index = container.children.length;

  // Create new image input
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.className = 'image-input';
  imageInput.name = `image${index}`;

  // Create new caption input
  const captionInput = document.createElement('textarea');
  captionInput.className = 'caption-input';
  captionInput.name = `caption${index}`;

  // Create new time input
    const timeInput = document.createElement('input');
    timeInput.type = 'datetime-local';
    timeInput.className = 'time-input';
    timeInput.name = `time${index}`;

// Create new input container
const inputContainer = document.createElement('div');
inputContainer.className = 'image-input-container';

// Add label and input elements to container
const imageLabel = document.createElement('label');
imageLabel.textContent = `Image ${index}:`;
inputContainer.appendChild(imageLabel);
inputContainer.appendChild(imageInput);
inputContainer.appendChild(document.createElement('br'));

const captionLabel = document.createElement('label');
captionLabel.textContent = `Caption ${index}:`;
inputContainer.appendChild(captionLabel);
inputContainer.appendChild(captionInput);
inputContainer.appendChild(document.createElement('br'));

const timeLabel = document.createElement('label');
timeLabel.textContent = `Time ${index}:`;
inputContainer.appendChild(timeLabel);
inputContainer.appendChild(timeInput);

// Add new input container to images div
const imagesDiv = document.getElementById('images');
imagesDiv.appendChild(inputContainer);}
