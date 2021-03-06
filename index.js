const models = {
    "Rainbow": [
        "#f00",
        "#ff0",
        "#0f0",
        "#0ff",
        "#00f",
        "#f0f"
    ],
    "Zebra": [
        "#000",
        "#fff"
    ]
};

let runModel = (function() {
    let f = function(model, speed) {
        f.abortAll();

        let body = $("body");

        function run(model, speed) {
            // console.log("run(" + model + ")");
            for (let i = 0; i < model.length - 1; ++i) {
                body = body.animate({
                    "background-color": model[i]
                }, speed, "linear");
            }

            body.animate({
                "background-color": model[model.length - 1]
            }, speed, "linear", function () {
                if (f.__allowReschedule) {
                    run(model, speed);
                }
            });
        }

        run(model, speed);
    };

    f.__allowReshedule = true;

    f.abortAll = function() {
        f.__allowReschedule = false;
        $("body").finish();
        f.__allowReschedule = true;
    };

    return f;
})();

function setupPanelAutoHide(selector) {
    function panelHide() {
        $(selector).not(":hover").delay(5000).fadeTo(1000, 0);
    }

    function panelShow() {
        $(selector).stop().fadeTo(150, 0.9, "swing", panelHide);
    }

    $(document).mousemove(panelShow);
    $(selector).hide();
    panelShow();
}

function colorModelId(modelName) {
    return "color-model-" + modelName;
}

function getSpeed() {
    return parseInt($("#speed").val());
}

function getModel() {
    const modelName = $("input[name='color-model']:checked").val();
    return models[modelName];
}

$(document).ready(function() {
    setupPanelAutoHide("#settings");

    let firstModel = null;
    for (const modelName in models) {
        if (firstModel === null) {
            firstModel = modelName;
        }

        const id = colorModelId(modelName);
        let button = $("<input type=\"radio\" class=\"btn-check\" name=\"color-model\" value=\"" + modelName + "\" id=\"" + id + "\" autocomplete=\"off\">");
        let label = $("<label class=\"btn btn-outline-primary\" for=\"" + id + "\">" + modelName + "</label>");

        button.click((function(modelName) {
            return function() {
                runModel(models[modelName], getSpeed());
            };
        })(modelName));

        $("#color-model").append(button, label);
    }

    if (firstModel !== null) {
        $("#" + colorModelId(firstModel)).click();
    }

    $("#speed").change(function() {
        $("#speed-lbl").text("Speed: " + getSpeed());
        runModel(getModel(), getSpeed());
    }).val(1000).change();
});