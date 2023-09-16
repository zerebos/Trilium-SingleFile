import helloworld from "./helloword.jsx";


(helloworld as CallableFunction)();

document.querySelector("#browser-window .address-bar")!.textContent = window.location.href;