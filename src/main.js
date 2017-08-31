//init app
let converter = (function() {

    //caching DOM
    let mainSelector = document.getElementById('container'),
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
        let currVal = Number(placeholderCurrency.value),
            firstValue = getSelected(selectCurrency),
            secondValue = getSelected(currentCurrency);
        //fetch data from api
        let data = fetch(request).then(resp => resp.json())
            .then((data) => {
                const mainObj = data.result;
                const eur = mainObj['eur'].pro;
                const usd = mainObj['usd'].pro;
                const rsd = 1;



                


              /*  function calculusBiger(cur1, cur2, val1, val2) {

                    if (firstValue == cur1 && secondValue == cur2) {
                        calculatedCurrency.value = parseFloat(currVal * (val1 * val2)).toFixed(2);
                    }
                }

                function calculusSmaller(cur1, cur2, val1, val2) {
                    if (firstValue == cur1 && secondValue == cur2) {
                        calculatedCurrency.value = parseFloat(currVal * (val1 / val2)).toFixed(2);
                    }
                }

                



                calculusSmaller("eur", "usd", eur, usd);
                calculusBiger("eur", "rsd", eur, rsd);
                calculusBiger("usd", "rsd", usd, rsd);
                calculusSmaller("usd", "eur", usd, eur);
                calculusSmaller("rsd", "eur", rsd, eur);
                calculusSmaller("rsd", "usd", rsd, usd);
                */


                if (!isNaN(placeholderCurrency.value)) {
                    placeholderCurrency.parentNode.removeAttribute('data-error');
                } else {
                    placeholderCurrency.parentNode.setAttribute('data-error', 'Please enter a number');
                    calculatedCurrency.value = (1 * Number(mainObj[firstValue].pro)).toFixed(2);
                }

                if (placeholderCurrency.value == "") {

                    calculatedCurrency.value = (1 * Number(mainObj[firstValue].pro)).toFixed(2);
                }

            })
            .catch((err) => {
                console.log(err);
            })
        return (function() {
            return {
                first: firstValue,
                second: secondValue,
                val: currVal
            }
        }());
    }


    //get option selected
    function getSelected(elem) {
        let opts = elem.children;
       let ii;
        for (ii= 0; ii < opts.length; ii++) {
            if (opts[ii].selected) {
                return opts[ii];
            }

        }
    }

    //set values for LocalStorage
    function setValues(elem, localval) {
        let opts = elem.children;
        let ii;
        for (ii = 0; ii < opts.length; ii++) {
            if (opts[ii].value == localval) {
                opts[ii].selected = "selected";
                return opts[ii].value;
            }
        }
    }

    //remove dupe currency if alrady selected
    function removeDupes(main, dupe) {
        let duplicateArr = main.children;
        let duplicate = dupe.children
        let ii;
        for (ii = 0; ii < duplicateArr.length; ii++) {
            if (duplicateArr[ii].selected) {
                if (duplicateArr[ii].value == duplicate[ii].value) {
                    $(duplicate[ii]).hide().siblings().show();

                }
            }

        }
    }

    //reset values of inputs
    function resetValues() {
        let ii;
        for (ii = 0; ii < allInputTxt.length; ii++) {
            allInputTxt[ii].value = 1;
        }
        calculateCurrency();
    }


    //init localStorage
    function localStoring() {
        let mainObj = calculateCurrency();
        localStorage.setItem('cubeSaved', JSON.stringify(mainObj));

    }

    let local = localStorage.getItem('cubeSaved');
    if (local !== "undefined") {
        let localStor = JSON.parse(local);
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


    return {

        calculateCurrency: calculateCurrency,
    }


}());

converter.calculateCurrency();