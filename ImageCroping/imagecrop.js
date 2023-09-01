
const imageInput = document.getElementById('image-input');
const imageCropper = document.querySelector('.image-cropper');
const cropButton = document.getElementById('crop-button');
const downloadLink = document.getElementById('download-link');
const resizeButton = document.getElementById('resize-button');
const resizeControls = document.getElementById('resize-controls');
const resizeWidthInput = document.getElementById('resize-width');
const resizeHeightInput = document.getElementById('resize-height');
const applyResizeButton = document.getElementById('apply-resize');
let cropper;

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            
            imageCropper.style.display = 'block';
            cropButton.style.display = 'block';
            downloadLink.style.display = 'none';
            resizeButton.style.display = 'block';
            resizeControls.style.display = 'none';
            image.src = e.target.result;

            // Initialize Cropper.js
            cropper = new Cropper(image, {
                aspectRatio: 1, 
                viewMode: 1,  
            });
        };

        reader.readAsDataURL(file);
    }
});


cropButton.addEventListener('click', () => {
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();

     
        downloadLink.href = croppedCanvas.toDataURL();
        downloadLink.style.display = 'block'; 
    }
});


resizeButton.addEventListener('click', () => {
    resizeControls.style.display = 'block'; 
});


applyResizeButton.addEventListener('click', () => {
    if (cropper) {
        const width = parseInt(resizeWidthInput.value);
        const height = parseInt(resizeHeightInput.value);

        if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
            cropper.setCanvasData({ width: width, height: height });

            
            const resizedCanvas = cropper.getCroppedCanvas({
                width: width,
                height: height,
            });

          
            downloadLink.href = resizedCanvas.toDataURL();
            downloadLink.style.display = 'block'; 
        }
    }
});
