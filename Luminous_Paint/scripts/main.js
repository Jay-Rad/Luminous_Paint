var Canvas;
var DrawModes;
(function (DrawModes) {
    DrawModes[DrawModes["Normal"] = 0] = "Normal";
    DrawModes[DrawModes["Glow"] = 1] = "Glow";
    DrawModes[DrawModes["Chalk"] = 2] = "Chalk";
    DrawModes[DrawModes["Shine"] = 3] = "Shine";
})(DrawModes || (DrawModes = {}));
var SketchPad = (function () {
    function SketchPad() {
        this.Context = document.getElementById("canvasMain").getContext("2d");
        this.Element = this.Context.canvas;
        this.DrawMode = DrawModes.Glow;
        this.CanvasBackgroundColor = "black";
        this.BrushColor = "rgba(125,125,125, 1)";
        this.BrushThickness = 3;
        this.ShadowBlurAmount = 10;
        this.ShadowColor = "rgba(255,255,255, 1)";
        this.ShadowOffsetX = 0;
        this.ShadowOffsetY = 0;
        this.CanvasWidth = 800;
        this.CanvasHeight = 600;
    }
    return SketchPad;
}());
function newCanvas() {
    Canvas.Element.style.width = String(Canvas.CanvasWidth) + "px";
    Canvas.Element.style.height = String(Canvas.CanvasHeight) + "px";
    Canvas.Element.width = Canvas.CanvasWidth;
    Canvas.Element.height = Canvas.CanvasHeight;
    Canvas.Context.fillStyle = Canvas.CanvasBackgroundColor;
    Canvas.Context.fillRect(0, 0, Canvas.CanvasWidth, Canvas.CanvasHeight);
}
function saveCanvas() {
    var url = Canvas.Element.toDataURL();
    var link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", "luminous_export.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function setBrushColor() {
    Canvas.BrushColor = "rgba(" + document.getElementById("inputBrushRed").value + ", " + document.getElementById("inputBrushGreen").value + ", " + document.getElementById("inputBrushBlue").value + ", " + document.getElementById("inputBrushAlpha").value + ")";
    document.getElementById("divBrushPreview").style.backgroundColor = Canvas.BrushColor;
}
function setShadowColor() {
    Canvas.ShadowColor = "rgba(" + document.getElementById("inputShadowRed").value + ", " + document.getElementById("inputShadowGreen").value + ", " + document.getElementById("inputShadowBlue").value + ", " + document.getElementById("inputShadowAlpha").value + ")";
    document.getElementById("divShadowPreview").style.backgroundColor = Canvas.ShadowColor;
}
function changeDrawMode(e) {
    var buttons = document.getElementById("divDrawModes").getElementsByClassName("toggle-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("selected", "false");
    }
    var button = e.currentTarget;
    button.setAttribute("selected", "true");
    if (button.innerHTML == "Normal") {
        Canvas.DrawMode = 0;
    }
    else if (button.innerHTML == "Glow") {
        Canvas.DrawMode = 1;
    }
    else if (button.innerHTML == "Chalk") {
        Canvas.DrawMode = 2;
    }
    else if (button.innerHTML == "Shine") {
        Canvas.DrawMode = 3;
    }
}
function addLine(x, y) {
    Canvas.Context.strokeStyle = Canvas.BrushColor;
    Canvas.Context.lineWidth = Canvas.BrushThickness;
    Canvas.Context.shadowBlur = Canvas.ShadowBlurAmount;
    Canvas.Context.shadowColor = Canvas.ShadowColor;
    Canvas.Context.shadowOffsetX = Canvas.ShadowOffsetX;
    Canvas.Context.shadowOffsetY = Canvas.ShadowOffsetY;
    if (Canvas.DrawMode == DrawModes.Glow) {
        Canvas.Context.beginPath();
        Canvas.Context.moveTo(Canvas.LastX, Canvas.LastY);
        Canvas.Context.lineTo(x, y);
        Canvas.Context.stroke();
    }
    else if (Canvas.DrawMode == DrawModes.Normal) {
        Canvas.Context.shadowBlur = 0;
        Canvas.Context.beginPath();
        Canvas.Context.moveTo(Canvas.LastX, Canvas.LastY);
        Canvas.Context.lineTo(x, y);
        Canvas.Context.stroke();
    }
    else if (Canvas.DrawMode == DrawModes.Chalk) {
        Canvas.Context.shadowBlur = 0;
        var startWidth = Canvas.Context.lineWidth;
        for (var i = 20; i > 0; i--) {
            Canvas.Context.lineWidth = startWidth + i;
            Canvas.Context.globalAlpha = (1 / (i * 3));
            Canvas.Context.beginPath();
            Canvas.Context.moveTo(Canvas.LastX, Canvas.LastY);
            Canvas.Context.lineTo(x, y);
            Canvas.Context.stroke();
        }
        Canvas.Context.globalAlpha = 1;
    }
    else if (Canvas.DrawMode == DrawModes.Shine) {
        Canvas.Context.beginPath();
        Canvas.Context.moveTo(Canvas.LastX, Canvas.LastY);
        Canvas.Context.lineTo(x, y);
        Canvas.Context.stroke();
        Canvas.Context.globalAlpha = .5;
        Canvas.Context.strokeStyle = "white";
        Canvas.Context.shadowColor = "white";
        Canvas.Context.shadowOffsetX = 0;
        Canvas.Context.shadowOffsetY = 0;
        Canvas.Context.shadowBlur = 0;
        Canvas.Context.lineWidth = Canvas.BrushThickness * .5;
        Canvas.Context.beginPath();
        Canvas.Context.moveTo(Canvas.LastX, Canvas.LastY);
        Canvas.Context.lineTo(x, y);
        Canvas.Context.stroke();
        Canvas.Context.globalAlpha = 1;
    }
    Canvas.LastX = x;
    Canvas.LastY = y;
}
$(document).ready(function () {
    Canvas = new SketchPad();
    //** Mouse Drawing **//
    Canvas.Element.onmousedown = function (e) {
        if (e.buttons == 1) {
            Canvas.LastX = e.clientX - e.currentTarget.getBoundingClientRect().left;
            Canvas.LastY = e.clientY - e.currentTarget.getBoundingClientRect().top;
        }
    };
    Canvas.Element.onmousemove = function (e) {
        e.preventDefault();
        if (e.buttons == 1) {
            e.preventDefault();
            var left = e.clientX - e.currentTarget.getBoundingClientRect().left;
            var top = e.clientY - e.currentTarget.getBoundingClientRect().top;
            addLine(left, top);
        }
    };
    //** Touch Drawing **//
    Canvas.Element.ontouchstart = function (e) {
        if (e.touches.length == 1) {
            Canvas.LastX = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
            Canvas.LastY = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
        }
    };
    Canvas.Element.ontouchmove = function (e) {
        if (e.touches.length == 1) {
            e.preventDefault();
            var left = e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left;
            var top = e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top;
            addLine(left, top);
        }
    };
    Canvas.Element.onmouseup = function (e) {
        Canvas.IsDrawing = false;
    };
    Canvas.Element.onmouseout = function (e) {
        Canvas.IsDrawing = false;
    };
    document.getElementById("divOptions").onclick = function (e) {
        var options = document.getElementById("divOptions");
        options.classList.remove("closed");
        options.classList.add("open");
    };
    document.getElementById("divOptions").onmouseenter = function (e) {
        document.getElementById("divOptions").setAttribute("hover", "true");
    };
    document.getElementById("divOptions").onmouseleave = function (e) {
        document.getElementById("divOptions").removeAttribute("hover");
    };
    document.getElementById("imgCloseOptions").onclick = function (e) {
        e.stopPropagation();
        var options = document.getElementById("divOptions");
        options.classList.remove("open");
        options.classList.add("closed");
    };
    newCanvas();
});
//# sourceMappingURL=main.js.map