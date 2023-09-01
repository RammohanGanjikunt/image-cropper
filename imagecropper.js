 const imageInput = document.getElementById('imageInput');
        const croppedImage = document.getElementById('croppedImage');
        const cropAndDownloadButton = document.getElementById('cropAndDownload');
        const downloadLink = document.getElementById('downloadLink');
        let cropper;

        // Handle image input change
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgDataUrl = event.target.result;
                    croppedImage.src = imgDataUrl;
                    // Initialize Cropper with a square aspect ratio (1:1)
                    cropper = new Cropper(croppedImage, {
                        aspectRatio: 1, // Set the aspect ratio to create a square
                        viewMode: 1, // Set the view mode as needed
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle crop and download
        cropAndDownloadButton.addEventListener('click', () => {
            if (cropper) {
                // Get the cropped data
                const croppedCanvas = cropper.getCroppedCanvas({
                    width: 200, // Adjust the width as needed
                    height: 200, // Adjust the height as needed
                });
                if (croppedCanvas) {
                    // Create a new canvas for circular crop
                    const circularCanvas = document.createElement('canvas');
                    const circularContext = circularCanvas.getContext('2d');
                    const radius = croppedCanvas.width / 2;
                    
                    // Set canvas size
                    circularCanvas.width = circularCanvas.height = radius * 2;

                    // Create circular mask
                    circularContext.beginPath();
                    circularContext.arc(radius, radius, radius, 0, 2 * Math.PI, false);
                    circularContext.closePath();
                    circularContext.clip();

                    // Draw the cropped image onto the circular canvas
                    circularContext.drawImage(croppedCanvas, 0, 0, croppedCanvas.width, croppedCanvas.height, 0, 0, radius * 2, radius * 2);

                    // Convert to data URL and trigger download
                    circularCanvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = 'cropped_image.png'; // Set the desired filename
                        downloadLink.style.display = 'block';
                        downloadLink.click(); // Trigger the download link
                    }, 'image/png'); // Save as PNG with transparent background
                }
            }
        });
