export default async function convertToGrayscale(inputImage) {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // If the image is from another domain, enable cross-origin access
    img.src = inputImage;
  
    await new Promise((resolve) => {
      img.onload = () => resolve();
    });
  
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
  
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }
  
    ctx.putImageData(imageData, 0, 0);
  
    return canvas.toDataURL('image/png'); // Convert canvas back to image data URL
  }