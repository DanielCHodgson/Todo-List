export default class Utility {

    static renderSvg(svgString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgString;
        return tempDiv.firstChild;
    }


    static createImg(imgSrc, imgClass, width, height) {
        const img = document.createElement("img");
        img.classList.add(imgClass);
        img.src = imgSrc;
        img.style.width = width;
        img.style.height = height;

        return img;
    }

}