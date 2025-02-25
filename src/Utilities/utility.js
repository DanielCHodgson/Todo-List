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

    static printHey() {
        console.log("HEY!")
    }

    static createSelectFormGroup(id, labeltext, options) {

        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("labeltext");
        label.setAttribute("for", id);
        label.textContent = labeltext;

        const select = document.createElement("select");
        select.id = id;

        options.forEach(o => {
            const option = document.createElement("option");
            option.textContent = o;
            option.value = o;
            select.appendChild(option);
        }) ;

        formGroup.appendChild(label);
        formGroup.appendChild(select);
        return formGroup;
    }

}