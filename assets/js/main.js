'use strict';

//init app
var converter = function() {

    //caching DOM
    var mainSelector = document.getElementById('container'),
        placeholderCurrency = mainSelector.querySelector('input[name="placeholder-currency"]'),
        calculatedCurrency = mainSelector.querySelector('input[name="calculated-currency"]'),
        selectCurrency = mainSelector.querySelector('select[name="selectedCurrency"]'),
        currentCurrency = mainSelector.querySelector('select[name="currentCurrency"]'),
        resetButton = mainSelector.getElementsByClassName('reset')[0],
        allInputTxt = mainSelector.querySelectorAll('input[type="text"]');

    //url data from api 
    var request = new Request('test.json', {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
            'Content-Type': 'text/plain'
        })
    });


    //initate app
    function calculateCurrency() {
        var currVal = Number(placeholderCurrency.value),
            firstValue = getSelected(selectCurrency).value,
            secondValue = getSelected(currentCurrency).value;

        //fetch data from api
        var data = fetch(request).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            var mainObj = data.result;
            var eur = mainObj['eur'].pro;
            var usd = mainObj['usd'].pro;
            var rsd = 1;


            function calculusSmaller(cur1, cur2) {

                calculatedCurrency.value = parseFloat(currVal * (cur1 / cur2)).toFixed(2);

            }

            function calculusBiger(cur1, cur2) {

                calculatedCurrency.value = parseFloat(currVal * (cur1 * cur2)).toFixed(2);

            }

            //adjusting values if empty or NaN

            if (!isNaN(placeholderCurrency.value)) {
                placeholderCurrency.parentNode.removeAttribute('data-error');
            } else {
                placeholderCurrency.parentNode.setAttribute('data-error', 'Please enter a number');
                currVal.replace(/[^0-9]+/g, "");
                mainCurrency();
            }

            if (placeholderCurrency.value == "") {
                currVal = 1;
                mainCurrency();
            }




            function mainCurrency(var1, var2) {
                var1 = firstValue;
                var2 = secondValue;
                switch (var1 + "|" + var2) {
                    case "usd|rsd":
                        calculusBiger(usd, rsd);
                        break;
                    case "eur|rsd":
                        calculusBiger(eur, rsd);
                        break;
                    case "rsd|usd":
                        calculusSmaller(rsd, usd);
                        break;
                    case "rsd|eur":
                        calculusSmaller(rsd, eur);
                        break;
                    case "eur|usd":
                        calculusSmaller(eur, usd);
                        break;
                    case "usd|eur":
                        calculusSmaller(usd, eur);
                        break;
                    default:
                        resetValues();

                }


            }

            mainCurrency();




        }).catch(function(err) {
            console.log(err);
        });
        return function() {
            return {
                first: firstValue,
                second: secondValue,
                val: currVal
            };
        }();
    }




    //get option selected
    function getSelected(elem) {
        var opts = elem.children;
        var ii = void 0;
        for (ii = 0; ii < opts.length; ii++) {
            if (opts[ii].selected) {
                return opts[ii];
            }
        }
    }

    //set values for LocalStorage
    function setValues(elem, localval) {
        var opts = elem.children;
        var ii = void 0;
        for (ii = 0; ii < opts.length; ii++) {
            if (opts[ii].value == localval) {
                opts[ii].selected = "selected";
                return opts[ii].value;
            }
        }
    }

    //remove dupe currency if alrady selected
    function removeDupes(main, dupe) {
        var duplicateArr = main.children;
        var duplicate = dupe.children;
        var ii = void 0;
        for (ii = 0; ii < duplicateArr.length; ii++) {
            if (duplicateArr[ii].selected) {
                if (duplicateArr[ii].value == duplicate[ii].value) {
                    var d = duplicate[ii];

                    for (var el of d.parentNode.querySelectorAll(".hide")) {
                        el.classList.remove("hide");
                    }
                    d.classList.add("hide");


                    // $(duplicate[ii]).hide().siblings().show();
                }
            }
        }
    }

    //reset values of inputs
    function resetValues() {
        var ii = void 0;
        for (ii = 0; ii < allInputTxt.length; ii++) {
            allInputTxt[ii].value = 1;
        }
        calculateCurrency();
    }

    //init localStorage
   function localStoring() {
        var mainObj = calculateCurrency();
        localStorage.setItem('cubeSaved', JSON.stringify(mainObj));
    }

    var local = localStorage.getItem('cubeSaved');
    if (local !== "undefined" && local !== null) {
        var localStor = JSON.parse(local);
        placeholderCurrency.value = localStor.val;
        setValues(selectCurrency, localStor.first);
        setValues(currentCurrency, localStor.second);
        calculatedCurrency.value = (placeholderCurrency.value * localStor.first).toFixed(2);
    } else {
        resetValues();
    }  
    
   



    //binding events
    placeholderCurrency.addEventListener('blur', localStoring);

    placeholderCurrency.addEventListener('keyup', calculateCurrency);

    selectCurrency.addEventListener('change', function() {

        calculateCurrency();
        removeDupes(selectCurrency, currentCurrency);
    });



    currentCurrency.addEventListener('change', function() {
        calculateCurrency();
        removeDupes(currentCurrency, selectCurrency);
    });

    resetButton.addEventListener('click', resetValues);

    removeDupes(selectCurrency, currentCurrency);


    return {

        calculateCurrency: calculateCurrency
    };
}();

converter.calculateCurrency();