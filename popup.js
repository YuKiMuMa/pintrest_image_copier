const grabBtn = document.getElementById("copy");
grabBtn.addEventListener("click",() => {    
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})



function execScript(tab) {
    // Execute a function on a page of the current browser tab
    // and process the result of execution
    chrome.scripting.executeScript(
        {
            target:{tabId: tab.id, allFrames: true},
            func:grabImages
        },
        onResult
    )
}

function grabImages() {
    //const clname = document.querySelector(".gridCenterd")
    const images = document.querySelectorAll(".Wk9.xQ4.CCY.S9z.DUt.kVc.agv.LIa img");
    //const images = document.querySelectorAll(".gridCentered");
    console.log(images)
    return Array.from(images).map(image=>image.srcset);    


    //html2clipboard("<img alt=\"Pin by Elan on Random SPARKS &amp; PROMPTS | Surreal art, Futuristic art, Photo manipulation fantasy\" class=\"hCL kVc L4E MIw\" fetchpriority=\"auto\" loading=\"auto\" src=\"https://i.pinimg.com/236x/6e/f8/00/6ef800a756f5850692cc6ad54e69f8dd.jpg\" srcset=\"https://i.pinimg.com/236x/6e/f8/00/6ef800a756f5850692cc6ad54e69f8dd.jpg 1x, https://i.pinimg.com/474x/6e/f8/00/6ef800a756f5850692cc6ad54e69f8dd.jpg 2x, https://i.pinimg.com/736x/6e/f8/00/6ef800a756f5850692cc6ad54e69f8dd.jpg 3x, https://i.pinimg.com/originals/6e/f8/00/6ef800a756f5850692cc6ad54e69f8dd.jpg 4x\">");

}

/**
 * Executed after all grabImages() calls finished on 
 * remote page
 * Combines results and copy a list of image URLs 
 * to clipboard
 * 
 * @param {[]InjectionResult} frames Array 
 * of grabImage() function execution results
 */
function onResult(frames) {
    // If script execution failed on remote end 
    // and could not return results
    if (!frames || !frames.length) { 
        alert("Could not retrieve images from specified page");
        return;
    }
    // Combine arrays of image URLs from 
    // each frame to a single array
    
    const imageUrls = frames.map(frame=>frame.result)
                            .reduce((r1,r2)=>r1.concat(r2));
    // Copy to clipboard a string of image URLs, delimited by 
    // carriage return symbol  
    const array1 = new Array(imageUrls.length);
    let n=0;
    imageUrls.forEach((elem, index) => {
        //console.log(elem.split(',')[3].split(' ')[1])
        try{
            array1[index]="<img src=\""+elem.split(',')[3].split(' ')[1]+"\"/>";
        }
        catch{
            n++;
        }
        //array1[index]="<img src=\""+elem+"\"/>";
    });
    alert("Number of images that could not be retrieved : "+n.toString());
    console.log(array1.join("\n"));
    html2clipboard(array1.join());
    window.close();

}

function html2clipboard(html, el) {
    var tmpEl;
    if (typeof el !== "undefined") {
        // you may want some specific styling for your content - then provide a custom DOM node with classes, inline styles or whatever you want
        tmpEl = el;
    } else {
        // else we'll just create one
        tmpEl = document.createElement("div");

        // since we remove the element immedeately we'd actually not have to style it - but IE 11 prompts us to confirm the clipboard interaction and until you click the confirm button, the element would show. so: still extra stuff for IE, as usual.
        tmpEl.style.opacity = 0;
        tmpEl.style.position = "absolute";
        tmpEl.style.pointerEvents = "none";
        tmpEl.style.zIndex = -1;
    }

    // fill it with your HTML
    tmpEl.innerHTML = html;

    // append the temporary node to the DOM
    document.body.appendChild(tmpEl);

    // select the newly added node
    var range = document.createRange();
    range.selectNode(tmpEl);
    window.getSelection().addRange(range);

    // copy
    document.execCommand("copy");

    // and remove the element immediately
    document.body.removeChild(tmpEl);
}