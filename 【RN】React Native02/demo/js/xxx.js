loadingCircle(item, idx, handleFn) {
    handleFn && handleFn()
    let vs = document.querySelector("#cvs" + idx);
    vs.setAttribute("width", this.clientWidth);
    vs.setAttribute("height", this.clientWidth);
    let ctx = vs.getContext("2d");
    let startAngle = -90, step = 3;
    let timerId;
    (() => {
        timerId = setInterval(() => {
            if (startAngle >= 270) {
                item.animateJb = true
                vs.height = vs.height
                clearInterval(timerId)
                timerId = null
                this.loadingCircle(item, idx, function () {
                    let timeOut = setTimeout(() => {
                        item.animateJb = false
                        vs.height = vs.height
                        timeOut && clearTimeout(timeOut) && (timeOut = null)
                    }, 1000)
                })
                return
            }
            ctx.beginPath()
            let x = Math.ceil(this.clientWidth / 2);
            let y = Math.ceil(this.clientWidth / 2);
            let r = Math.ceil(this.clientWidth / 2);
            ctx.strokeStyle = "#f35b5d";
            ctx.lineWidth = 2;
            ctx.arc(
                x,
                y,
                r,
                startAngle / 180 * Math.PI,
                (startAngle += step) / 180 * Math.PI
            );
            ctx.stroke();
        }, 50);
    })()
}