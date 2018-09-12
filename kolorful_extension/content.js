document.addEventListener('DOMContentLoaded', function() {

  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      console.log(document.getElementsByTagName("img"););
      //dictionary will have hex values and how many pixels of that hex value appeared
      var color_distribution = {};
      //array od all Image elements on webpage
      var tab_imgs = document.getElementsByTagName("img");
      //integer to hold total number of pixels on all images on webpage
      var total_pixels = 0;

      //loop through each image object
      for(var i = 0; i < tab_imgs.length; i++){
        total_pixels = total_pixels + (tab_imgs[i].height * tab_imgs[i].width);
        //loop thorugh the current image i rows
        for(var row = 0; row < tab_imgs[i].height; row++){
          //loop thorugh the current image i columns
          for(var column = 0; column < tab_imgs[i].width; column++){
            //get the pixel data of the current (row,column) pixel
            var curr_pixel = getPixel(tab_imgs[i].url, row, column);
            //convert current pixel rgba value to hex {rgba(197, 200, 198, .2) string format}
            var string_rgba = "rgba(";

            string_rgba = string_rgba + curr_pixel[0].toString();
            string_rgba = string_rgba + ", ";
            string_rgba = string_rgba + curr_pixel[1].toString();
            string_rgba = string_rgba + ", ";
            string_rgba = string_rgba + curr_pixel[2].toString();
            string_rgba = string_rgba + ", ";
            string_rgba = string_rgba + curr_pixel[3].toString();
            string_rgba = string_rgba + ")";

            var string_hex = rgbaToHex(string_rgba);

            if(color_distribution[string_hex] == null){
                color_distribution[string_hex] = 1;
            }
            else{
                color_distribution[string_hex] = color_distribution[string_hex] + 1;
            }

          }
        }
      }

    });
  }, false);
}, false);


function getPixel(url, x, y) {
  var img = new Image();
  img.src = url;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  return context.getImageData(x, y, 1, 1).data;
}

function trim (str) {
  return str.replace(/^\s+|\s+$/gm,'');
}

function rgbaToHex (rgba) {
    var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt(trim(parts[0].substring(1)), 10),
        g = parseInt(trim(parts[1]), 10),
        b = parseInt(trim(parts[2]), 10),
        a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

    return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0,2));
}
