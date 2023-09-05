document.addEventListener('DOMContentLoaded', function () {
  var displayImage = document.getElementById('display_image_data');
  var browseImage = document.getElementById('browse_image');
  var cropButton = document.getElementById('crop_button');
  var croppable = false;
  var cropper;

  // Function to handle image selection
  browseImage.addEventListener('change', function (e) {
    var files = e.target.files;
    var done = function (url) {
      displayImage.src = url;
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(displayImage, {
        aspectRatio: 1,
        viewMode: 1,
        ready: function () {
          croppable = true;
        },
      });
    };
    if (files && files.length > 0) {
      var file = files[0];
      if (URL) {
        done(URL.createObjectURL(file));
      } else {
        var reader = new FileReader();
        reader.onload = function (e) {
          done(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Function to handle cropping and downloading
  cropButton.addEventListener('click', function () {
    if (!croppable) {
      return;
    }
    var croppedCanvas = cropper.getCroppedCanvas();

    // Create a new canvas for the download image
    var downloadCanvas = document.createElement('canvas');
    var downloadContext = downloadCanvas.getContext('2d');
    var width = croppedCanvas.width;
    var height = croppedCanvas.height;

    // Define the points for the triangle shape
    var points = [
      { x: width / 2, y: 0 },
      { x: 0, y: height },
      { x: width, y: height },
    ];

    // Clip the cropped image into a triangle shape
    downloadCanvas.width = width;
    downloadCanvas.height = height;
    downloadContext.beginPath();
    downloadContext.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      downloadContext.lineTo(points[i].x, points[i].y);
    }
    downloadContext.closePath();
    downloadContext.clip();
    downloadContext.drawImage(croppedCanvas, 0, 0);

    // Set the download image source to the clipped triangle
    var linkSource = downloadCanvas.toDataURL('image/png');
    var fileName = 'download.png';
    var downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  });
});
