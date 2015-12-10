function init() {
    controller.init();
}

var controller = (function () {

    var allMotors;
    var allModels;
    var allPackages;
    var allColors;

    // Initializes all needed configurations
    function publicInit() {
        allMotors = new Items();
        allModels = new Items();
        allPackages = new Items();
        allColors = new Items();

        initAllMotors();
        initAllModels();
        initAllPackages();
        initAllColors();

        // Set the click events of the buttons and the change event of the list
        $("#price-button").click(getPrice);
        $("#color-list").change(changeImage);
        $("#load-button").click(initLocalStorage);
        $("#save-button").click(setLocaleStorage)
    }

    // Load the data of the locale storage
    function initLocalStorage() {
        // Tries to load the locale storage if it is saved
        try {
            var motor = getParsedJSONstring("motor");
            setButtons("radio", "motorsRadio", motor);
        } catch (err) {}
        try {
            var model = getParsedJSONstring("model");
            setButtons("radio", "modelsRadio", model);
        } catch (err) {}
        try {
            var packages = getParsedJSONstring("packages");
            for (var i = 0; i < packages.length; i++)
                setButtons("checkbox", "packagesCheckbox", packages[i]);
        } catch (err) {}
        try {
            var color = getParsedJSONstring("color");
            var src = null;
            if (color != null)
                src = allColors.getPriceOrSrc(color.replace(new RegExp(" ", "g"), ""));

            if (src == null) {
                src = "img/bmw_3_melbourne_red.jpeg";
                color = "Melbourne Rot Metallic";
            }
            $("#car-image").attr("src", src);
            $('#color-list option[value="' + color.replace(new RegExp(" ", "g"), "") + '"]').prop('selected', true);
        } catch (err) {}
        try {
            var price = getParsedJSONstring("price");
            $("#price-label").text(getPriceString(price));
        } catch (err) {}


    }

    function setButtons(type, key, savedState) {
        $('input:' + type + '[name="' + key + '"]').filter('[value="' + savedState + '"]').attr('checked', true);
    }

    // Set the locale storage if the save button is clicked
    function setLocaleStorage() {
        
        // Get the selected values of all configurations
        var motor = $('input[name="motorsRadio"]:checked').val();
        var model = $('input[name="modelsRadio"]:checked').val();
        var packages = [];
        $('input[name="packagesCheckbox"]:checked').each(function () {
            packages.push($(this).val());
        });

        // Get the JSON strings of the objects
        var JSONmotor = JSON.stringify(motor);
        var JSONmodel = JSON.stringify(model);
        var JSONpackages = JSON.stringify(packages);
        var JSONcolor = JSON.stringify($('#color-list>option:selected').text());
        var JSONprice;
        if (JSONmotor != undefined)
            JSONprice = JSON.stringify(getPrice());

        // Set the locale storage of the browser, so you can reload it
        localStorage.setItem("motor", JSONmotor);
        localStorage.setItem("model", JSONmodel);
        localStorage.setItem("packages", JSONpackages);
        localStorage.setItem("color", JSONcolor);
        localStorage.setItem("price", JSONprice);
    }

    // Initializes all motors
    function initAllMotors() {

        allMotors.addItem("318i", 31900);
        allMotors.addItem("320i", 36450);
        allMotors.addItem("330i", 41500);
        allMotors.addItem("340i", 49850);

        var motorList = allMotors.getItems();
        var motorsFieldset = $("#all-motors");

        // Manipulates the html site so the input radio buttons will show 
        for (var i = 0; i < motorList.length; i++) {
            motor_element = $('<input type="radio" name="motorsRadio" value=' + motorList[i].replace(new RegExp(" ", "g"), "") + '>' + motorList[i] + '<br/></input>');
            motorsFieldset.append(motor_element);
        }
    }

    // Initializes all models
    function initAllModels() {
        allModels.addItem("Modell Standard", 0);
        allModels.addItem("Modell Advantage", 750);
        allModels.addItem("Modell Luxury Line", 5300);
        allModels.addItem("Modell M Sport", 5500);
        allModels.addItem("Modell Sport Line", 3300);

        var modelList = allModels.getItems();
        var modelsFieldset = $("#all-models");

        for (var i = 0; i < modelList.length; i++) {
            model_element = $('<input type="radio" name="modelsRadio" value=' + modelList[i].replace(new RegExp(" ", "g"), "") + '>' + modelList[i] + '<br/></input>');
            modelsFieldset.append(model_element);
        }
    }

    // Initializes all packages
    function initAllPackages() {

        allPackages.addItem("BMW Individual Komposition", 4250);
        allPackages.addItem("Connected Drive Services Paket", 700);
        allPackages.addItem("Innovationspaket", 2600);
        allPackages.addItem("Navigationspaket Connected Drive", 3200);

        var packagesList = allPackages.getItems();
        var packagesFieldset = $("#all-packages");

        for (var i = 0; i < packagesList.length; i++) {
            package_element = $('<input type="checkbox" name="packagesCheckbox" value=' + packagesList[i].replace(new RegExp(" ", "g"), "") + '>' + packagesList[i] + '<br/></input>');
            packagesFieldset.append(package_element);
        }
    }

    // Initializes all colors
    function initAllColors() {

        allColors.addItem("Melbourne Rot Metallic", "img/bmw_3_melbourne_red.jpeg");
        allColors.addItem("Saphirschwarz Metallic", "img/bmw_3_saph_black.jpeg");
        allColors.addItem("Mediterranblau Metallic", "img/bmw_3_med_blue.jpeg");

        var colorList = allColors.getItems();
        var colorsFieldset = $("#all-colors");

        // Creates the html list box with all colors
        var colorString = '<select id="color-list" size="' + colorList.length + '"> ';
        for (var i = 0; i < colorList.length; i++) {
            colorString += '<option value="' + colorList[i].replace(new RegExp(" ", "g"), "") + '">' + colorList[i] + '</option>';
        }
        colorString += '</select>';
        var color_list = $(colorString);
        colorsFieldset.append(color_list);

        // Sets the default picture on load of the site
        var src = "img/bmw_3_melbourne_red.jpeg";
        var color = "Melbourne Rot Metallic";
        $("#car-image").attr("src", src);
        $('#color-list option[value="' + color.replace(new RegExp(" ", "g"), "") + '"]').prop('selected', true);
    }

    // Changes the image if a other color is selected
    function changeImage() {
        var imgList = allColors.getItems();

        // Get the selected color and changes the image source
        var selColor = $('#color-list>option:selected').text();
        var src = allColors.getPriceOrSrc(selColor.replace(new RegExp(" ", "g"), ""));

        // Sets the new source, so the picture will change
        $("#car-image").attr("src", src);

    }

    // Calculates the price of the selected options
    function getPrice() {
        // Gets the selected value of the radio buttons
        var motor = $('input[name="motorsRadio"]:checked').val();
        if (motor == undefined) {
            alert("No motor was selected!");
            return;
        }
        var model = $('input[name="modelsRadio"]:checked').val();
        var packages = [];
        // Save all selected packages in an array
        $('input[name="packagesCheckbox"]:checked').each(function () {
            packages.push($(this).val());
        });

        var price = allMotors.getPriceOrSrc(motor) + allModels.getPriceOrSrc(model);

        for (var i = 0; i < packages.length; i++) {
            price += allPackages.getPriceOrSrc(packages[i]);
        }

        // Sets the price on the label, so you can see the calculated price
        $("#price-label").text(getPriceString(price));

        return price;
    }
    
    // Returns a string of the JSON object
    function getParsedJSONstring(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Formats the price
    function getPriceString(price) {
        price = price.toString();
        var lastPart = price.substr(price.length - 3);
        var firstPart = price.substr(0, price.length - 3);
        var priceString = firstPart + "." + lastPart + ",00€";

        return priceString;
    }

    // The methods you can call of this object
    return {
        init: publicInit
    };

})();